import React from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="profile">
        <h1>Profile</h1>
        <div className="not-logged-in">
          <p>Please log in to view your profile</p>
          <button onClick={() => navigate('/login')}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile">
      <h1>Profile</h1>
      <div className="profile-content">
        <div className="profile-info">
          <h2>Welcome, {user.name || user.email || 'User'}!</h2>
          <div className="profile-details">
            {user.email && <p>Email: {user.email}</p>}
            {user.phone && <p>Phone: {user.phone}</p>}
          </div>
        </div>
        <div className="profile-actions">
          <button onClick={logout}>Logout</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;

