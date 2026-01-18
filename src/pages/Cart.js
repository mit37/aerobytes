import React from 'react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

// Convert USD to SOL (approximate rate: 1 SOL ≈ $100)
const USD_TO_SOL_RATE = 100;

function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();

  const getTotalPriceInSOL = () => {
    return getTotalPrice() / USD_TO_SOL_RATE;
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart">
        <h1>Your Cart</h1>
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button onClick={() => navigate('/menu')} className="browse-btn">Browse Menu</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <h1>Your Cart</h1>
      <div className="cart-items">
        {items.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="item-info">
              <h3>{item.name}</h3>
              <p>Included in Meal Bundle</p>
            </div>
            <div className="item-controls">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              <button onClick={() => removeFromCart(item.id)} className="remove-btn">Remove</button>
            </div>
            <div className="item-total">
              -
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="total">
          <h2>Meal Bundle Total: {getTotalPriceInSOL().toFixed(4)} SOL</h2>
          <p className="solana-badge">💎 Powered by Solana</p>
        </div>
        <div className="cart-actions">
          <button onClick={clearCart}>Clear Cart</button>
          <button onClick={handleCheckout} className="checkout-btn">Checkout</button>
        </div>
      </div>
    </div>
  );
}

export default Cart;

