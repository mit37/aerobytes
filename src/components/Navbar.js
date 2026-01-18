import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🍌</span>
          <span className="logo-text">SlugBites</span>
        </Link>

        <div className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="navbar-link" onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </Link>
          <Link to="/menu" className="navbar-link" onClick={() => setIsMobileMenuOpen(false)}>
            Menu
          </Link>
          <Link to="/solana" className="navbar-link" onClick={() => setIsMobileMenuOpen(false)}>
            Why Solana
          </Link>
          <Link to="/track-order" className="navbar-link" onClick={() => setIsMobileMenuOpen(false)}>
            Track Order
          </Link>
          {user ? (
            <Link to="/profile" className="navbar-link" onClick={() => setIsMobileMenuOpen(false)}>
              Profile
            </Link>
          ) : (
            <Link to="/login" className="navbar-link" onClick={() => setIsMobileMenuOpen(false)}>
              Login
            </Link>
          )}
        </div>

        <div className="navbar-actions">
          <button 
            className="cart-button"
            onClick={() => navigate('/cart')}
          >
            <span className="cart-icon">🛒</span>
            {getTotalItems() > 0 && (
              <span className="cart-badge">{getTotalItems()}</span>
            )}
          </button>
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

