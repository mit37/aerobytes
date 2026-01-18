import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import './OrderTracking.css';

// Use relative URLs for production (Vercel), absolute for local development
// Use relative URLs for production (Vercel), absolute for local development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function OrderTracking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState(null);
  const [userHistory, setUserHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    } else if (user) {
      fetchUserHistory(user.email);
    }
  }, [orderId, user]);

  const fetchUserHistory = async (email) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/users/${email}/orders`);
      if (!response.ok) throw new Error('Failed to fetch history');
      const data = await response.json();
      setUserHistory(data.orders || []);
    } catch (err) {
      console.error('Error fetching history:', err);
      // Don't show error for history, just empty list
      setUserHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrder = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/orders/${id}`);

      if (!response.ok) {
        throw new Error('Order not found');
      }

      const data = await response.json();
      setOrder(data);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Order not found. Please check your order ID.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ff9800';
      case 'preparing': return '#2196f3';
      case 'out_for_delivery': return '#9c27b0';
      case 'delivered': return '#4caf50';
      case 'cancelled': return '#f44336';
      default: return '#666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Order Received';
      case 'preparing': return 'Preparing Your Order';
      case 'out_for_delivery': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  return (
    <div className="order-tracking">
      <h1>Track Your Order</h1>

      {!orderId ? (
        <div className="order-history">
          {user ? (
            <>
              <h2>Your Past Orders ({user.email})</h2>
              {loading ? (
                <p>Loading history...</p>
              ) : userHistory.length > 0 ? (
                <div className="history-list">
                  {userHistory.map(hist => (
                    <div key={hist.orderId} className="history-card" onClick={() => navigate(`/track-order?orderId=${hist.orderId}`)}>
                      <div className="history-header">
                        <strong>Order #{hist.orderId}</strong>
                        <span>{new Date(hist.orderDate).toLocaleDateString()}</span>
                      </div>
                      <div className="history-summary">
                        <span>{hist.items.length} items</span>
                        <span>${hist.total.toFixed(2)}</span>
                        <span className="status-tag" style={{ color: getStatusColor(hist.status) }}>
                          {getStatusText(hist.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-orders">
                  <p>You haven't placed any orders yet.</p>
                  <button onClick={() => navigate('/menu')} className="back-btn">Order Now</button>
                </div>
              )}
            </>
          ) : (
            <div className="no-orders">
              <p>Please log in to view your order history</p>
              <button onClick={() => navigate('/login')} className="back-btn">Login</button>
            </div>
          )}
        </div>
      ) : loading ? (
        <div className="loading">
          <p>Loading order information...</p>
        </div>
      ) : error ? (
        <div className="error">
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="back-btn">
            Go to Home
          </button>
        </div>
      ) : order ? (
        <div className="order-details">
          <div className="order-header">
            <h2>Order #{order.orderId}</h2>
            <div
              className="order-status"
              style={{ backgroundColor: getStatusColor(order.status) }}
            >
              {getStatusText(order.status)}
            </div>
          </div>

          <div className="order-info">
            <div className="info-section">
              <h3>Customer Information</h3>
              <p><strong>Name:</strong> {order.customer.name}</p>
              <p><strong>Email:</strong> {order.customer.email}</p>
              <p><strong>Phone:</strong> {order.customer.phone}</p>
              <p><strong>Address:</strong> {order.customer.address}</p>
              {order.customer.city && <p><strong>City:</strong> {order.customer.city}</p>}
              {order.customer.zipCode && <p><strong>Zip Code:</strong> {order.customer.zipCode}</p>}
              {order.customer.deliveryInstructions && (
                <p><strong>Delivery Instructions:</strong> {order.customer.deliveryInstructions}</p>
              )}
            </div>

            <div className="info-section">
              <h3>Order Items</h3>
              <div className="order-items-list">
                {order.items.map((item) => (
                  <div key={item.id} className="order-item">
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">x{item.quantity}</span>
                    <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="order-total">
                <strong>Total: ${order.total.toFixed(2)}</strong>
              </div>
            </div>

            <div className="info-section">
              <h3>Order Details</h3>
              <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
              <p><strong>Order ID:</strong> {order.orderId}</p>
            </div>
          </div>

          <div className="order-actions">
            <button onClick={() => navigate('/menu')} className="back-btn">
              Order More
            </button>
            <button onClick={() => navigate('/')} className="back-btn">
              Back to Home
            </button>
          </div>
        </div>
      ) : (
        <div className="no-orders">
          <p>No order found</p>
        </div>
      )}
    </div>
  );
}

export default OrderTracking;

