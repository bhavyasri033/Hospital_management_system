import React from 'react';
import './Navbar.css';

const Navbar = ({ userRole }) => {
  const getRoleDisplay = () => {
    switch(userRole) {
      case 'admin':
        return 'Administrator';
      case 'doctor':
        return 'Doctor';
      case 'pharma':
        return 'Pharmaceutical Admin';
      default:
        return 'Guest';
    }
  };

  return (
    <div className="navbar">
      <div className="app-name">HMS System</div>
      <div className="user-role">
        <span className="role-label">Role:</span>
        <span className="role-value">{getRoleDisplay()}</span>
      </div>
    </div>
  );
};

export default Navbar; 