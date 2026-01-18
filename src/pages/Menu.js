import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Menu.css';

// Use relative URLs for production (Vercel), absolute for local development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function Menu() {
  const [searchParams] = useSearchParams();
  const locationId = searchParams.get('location');
  const navigate = useNavigate();

  const [diningLocations, setDiningLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, setMealPrice } = useCart();
  const [currentPrice, setCurrentPrice] = useState(0);

  const fetchDiningLocations = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dining-locations`);

      if (!response.ok) {
        throw new Error('Failed to fetch dining locations');
      }

      const data = await response.json();
      setDiningLocations(data);

      // Set selected location if locationId matches
      if (locationId) {
        const location = data.find(loc => loc.id === locationId);
        setSelectedLocation(location || data[0]);
      } else if (data.length > 0) {
        setSelectedLocation(data[0]);
      }
    } catch (err) {
      console.error('Error fetching dining locations:', err);
      setError('Failed to load dining locations.');
      setDiningLocations([]);
    }
  }, [locationId]);

  const fetchMenuItems = useCallback(async (locId) => {
    try {
      setLoading(true);
      setError(null);

      // Find the location to get locationName
      const location = diningLocations.find(loc => loc.id === locId);

      // Build URL
      const url = `${API_BASE_URL}/api/menu-items?locationId=${locId}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add this to handle local network requests
        mode: 'cors',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Menu items response not OK:', response.status, errorText);
        throw new Error(`Failed to fetch menu items: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Received ${data.menuItems?.length || 0} menu items from backend`);

      // Check if location is closed
      if (data.message && data.message.includes('closed')) {
        setMenuItems([]);
        setError('This dining location is currently closed.');
        return;
      }

      // Set price from backend
      if (data.currentPrice) {
        setCurrentPrice(data.currentPrice);
        setMealPrice(data.currentPrice);
      }

      // Handle both formats: { menuItems: [...] } or just [...]
      let menuItemsArray = [];
      if (data.menuItems && Array.isArray(data.menuItems)) {
        menuItemsArray = data.menuItems;
      } else if (Array.isArray(data)) {
        menuItemsArray = data;
      }

      if (menuItemsArray.length > 0) {
        setMenuItems(menuItemsArray);
      } else {
        console.warn('No menu items returned');
        setError('Menu items coming soon!');
      }

      // Update selected location
      if (location) {
        setSelectedLocation(location);
      }
    } catch (err) {
      console.error('Error fetching menu items:', err);
      setError('Failed to load menu items. Please try again later.');
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  }, [diningLocations, setMealPrice]);

  useEffect(() => {
    fetchDiningLocations();
  }, [fetchDiningLocations]);

  useEffect(() => {
    if (locationId) {
      fetchMenuItems(locationId);
    } else if (diningLocations.length > 0) {
      // Default to first location if none selected
      const firstLocation = diningLocations[0];
      navigate(`/menu?location=${firstLocation.id}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationId, fetchMenuItems, navigate]); // Removed diningLocations from deps to prevent loop

  const handleLocationChange = (newLocationId) => {
    navigate(`/menu?location=${newLocationId}`);
  };

  const handleAddToCart = (item) => {
    // Menu items are included in the flat rate
    const cartItem = {
      ...item,
      price: 0,
      quantity: 1
    };
    addToCart(cartItem);
  };

  if (!locationId && diningLocations.length === 0 && !loading) {
    return (
      <div className="menu">
        <div className="error">
          <p>No dining locations available. Please go back to the home page.</p>
          <button onClick={() => navigate('/')}>Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="menu">
      <div className="menu-header">
        <h1>Menu</h1>

        {diningLocations.length > 0 && (
          <div className="location-selector">
            <label htmlFor="location-select">Dining Location: </label>
            <select
              id="location-select"
              value={selectedLocation?.id || ''}
              onChange={(e) => handleLocationChange(e.target.value)}
            >
              {diningLocations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading && (
        <div className="loading">
          <p>Loading menu items...</p>
          <div className="spinner"></div>
        </div>
      )}

      {error && (
        <div className="error">
          <p>{error}</p>
          <button onClick={() => locationId && fetchMenuItems(locationId)}>Retry</button>
        </div>
      )}

      {!loading && menuItems.length === 0 && (
        <div className="menu-items">
          <div className="menu-item-card placeholder-card">
            <div className="menu-item-info">
              <h3>{error && error.includes('closed') ? 'Dining Location Closed' : 'Menu items coming soon'}</h3>
              <p className="placeholder-text">
                {error && error.includes('closed')
                  ? 'This dining location is currently closed. Please check back during operating hours.'
                  : "We're getting things ready! Check back later for fresh slug-delivered meals."}
              </p>
              <p className="item-price">{error && error.includes('closed') ? 'Closed' : 'Not Available Yet'}</p>
            </div>
            <button
              className="return-home-btn"
              onClick={() => navigate('/')}
            >
              Return to Home
            </button>
          </div>
        </div>
      )}

      {!loading && !error && menuItems.length > 0 && (
        <>
          <div className="pricing-info" style={{ textAlign: 'center', margin: '1rem 0', padding: '1rem', backgroundColor: '#e6fffa', borderRadius: '8px' }}>
            <h2>Unlimited Food Access: {(currentPrice / 100).toFixed(4)} SOL</h2>
            <p>Select up to 4 items per order • 💎 Powered by Solana</p>
          </div>
          <div className="menu-items">
            {menuItems.map((item) => (
              <div key={item.id} className="menu-item-card">
                <div className="menu-item-info">
                  <h3>{item.name}</h3>
                  {item.calories !== null && item.calories > 0 && (
                    <p className="calories">{item.calories} calories</p>
                  )}
                  <span className={`availability ${item.is_available ? 'available' : 'unavailable'}`}>
                    {item.is_available ? 'Available' : 'Unavailable'}
                  </span>
                  <p className="item-price">Included</p>
                </div>
                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(item)}
                  disabled={!item.is_available}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Menu;

