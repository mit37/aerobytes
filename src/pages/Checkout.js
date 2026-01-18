import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

// Use relative URLs for production (Vercel), absolute for local development
const API_BASE_URL = process.env.NODE_ENV === 'production' ? '' : (process.env.REACT_APP_API_URL || 'http://localhost:3001');

// Convert USD to SOL (approximate rate: 1 SOL ≈ $100)
const USD_TO_SOL_RATE = 100;

function Checkout() {
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();

  const getTotalPriceInSOL = () => {
    return getTotalPrice() / USD_TO_SOL_RATE;
  };
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    zipCode: '',
    deliveryInstructions: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      setError('Please fill in all required fields (Name, Email, Phone, Address)');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const orderData = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          deliveryInstructions: formData.deliveryInstructions
        },
        items: items,
        total: getTotalPrice(),
        orderDate: new Date().toISOString(),
        status: 'pending'
      };

      // Submit order to backend
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      const result = await response.json();

      // Clear cart and navigate to order tracking
      clearCart();
      navigate(`/track-order?orderId=${result.orderId}`);
    } catch (err) {
      console.error('Error placing order:', err);
      setError('Failed to place order. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="checkout">
        <h1>Checkout</h1>
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button onClick={() => navigate('/menu')} className="browse-btn">Browse Menu</button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout">
      <h1>Checkout</h1>
      <div className="checkout-content">
        <div className="order-summary">
          <h2>Order Summary</h2>
          {items.map((item) => (
            <div key={item.id} className="order-item">
              <span>{item.name} x {item.quantity}</span>
              <span>{((item.price || 0) * item.quantity / USD_TO_SOL_RATE).toFixed(4)} SOL</span>
            </div>
          ))}
          <div className="order-total">
            <strong>Total: {getTotalPriceInSOL().toFixed(4)} SOL</strong>
            <p className="payment-method">💎 Payment via Solana Blockchain</p>
          </div>
        </div>
        <div className="checkout-form">
          <h2>Delivery Information</h2>
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}
          <form onSubmit={handleCheckout}>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="John Doe"
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="john@example.com"
              />
            </div>
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="(555) 123-4567"
              />
            </div>
            <div className="form-group">
              <label>Street Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                placeholder="123 Main St"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Santa Cruz"
                />
              </div>
              <div className="form-group">
                <label>Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  placeholder="95064"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Delivery Instructions (Optional)</label>
              <textarea
                name="deliveryInstructions"
                value={formData.deliveryInstructions}
                onChange={handleInputChange}
                placeholder="Any special delivery instructions..."
                rows="3"
              />
            </div>
            <div className="solana-payment-info">
              <p>💎 This order will be processed using Solana blockchain</p>
              <p className="solana-benefits">Instant • Low Fees • Secure</p>
            </div>
            <button
              type="submit"
              className="place-order-btn"
              disabled={isSubmitting || items.length === 0}
            >
              {isSubmitting ? 'Processing Payment...' : 'Pay with Solana'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Checkout;

