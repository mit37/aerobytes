import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

// Use relative URLs for production (Vercel), absolute for local development
const API_BASE_URL = process.env.NODE_ENV === 'production' ? '' : (process.env.REACT_APP_API_URL || 'http://localhost:3001');

function Home() {
  const [diningLocations, setDiningLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDiningLocations();
  }, []);

  const fetchDiningLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching dining locations from:', `${API_BASE_URL}/api/dining-locations`);

      const response = await fetch(`${API_BASE_URL}/api/dining-locations`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response not OK:', response.status, errorText);
        throw new Error(`Failed to fetch dining locations: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received dining locations:', data);
      console.log('Number of locations:', Array.isArray(data) ? data.length : 'Not an array');

      if (Array.isArray(data)) {
        if (data.length > 0) {
          setDiningLocations(data);
        } else {
          console.warn('Empty array received');
          setDiningLocations([]);
          setError('No dining locations found.');
        }
      } else {
        console.error('Invalid data format:', typeof data, data);
        setDiningLocations([]);
        setError('Invalid response from server.');
      }
    } catch (err) {
      console.error('Error fetching dining locations:', err);
      setError(`Failed to load dining locations: ${err.message}`);
      setDiningLocations([]); // Graceful degradation
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (locationId) => {
    navigate(`/menu?location=${locationId}`);
  };

  return (
    <div className="home">
      <div className="home-hero">
        <h1>SlugBites</h1>
        <p>Fast, reliable food delivery from UCSC dining halls</p>
      </div>

      <div className="home-content">
        <h2>Select a Dining Location</h2>

        {loading && (
          <div className="loading">
            <p>Loading dining locations...</p>
            <div className="spinner"></div>
          </div>
        )}

        {error && (
          <div className="error">
            <p>{error}</p>
            <button onClick={fetchDiningLocations}>Retry</button>
          </div>
        )}

        {!loading && !error && diningLocations.length === 0 && (
          <div className="no-data">
            <p>No dining locations available at this time.</p>
          </div>
        )}

        {!loading && !error && diningLocations.length > 0 && (
          <div className="locations-grid">
            {diningLocations.map((location) => (
              <div
                key={location.id}
                className="location-card"
                onClick={() => handleLocationSelect(location.id)}
              >
                <h3>{location.name}</h3>
                <div className="location-info">
                  <span className={`status ${location.is_open ? 'open' : 'closed'}`}>
                    {location.is_open ? 'Open' : 'Closed'}
                  </span>
                  {location.supports_drone && (
                    <span className="drone-badge">🍌 Slug Delivery Available</span>
                  )}
                </div>
                {location.url && (
                  <a
                    href={location.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="menu-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Full Menu →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;

