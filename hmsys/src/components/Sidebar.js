import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggle, userRole, onLogout }) => {
  const menuItems = {
    admin: [
      { path: '/dashboard', name: 'Dashboard', icon: '📊' },
      { path: '/patients', name: 'Patients', icon: '🏥' },
      { path: '/doctors', name: 'Doctors', icon: '👨‍⚕️' },
      { path: '/appointments', name: 'Appointments', icon: '📅' },
      { path: '/inventory', name: 'Inventory', icon: '📦' },
      { path: '/logout', name: 'Logout', icon: '🚪', action: onLogout }
    ],
    doctor: [
      { path: '/dashboard', name: 'Dashboard', icon: '📊' },
      { path: '/appointments', name: 'Appointments', icon: '📅' },
      { path: '/logout', name: 'Logout', icon: '🚪', action: onLogout }
    ],
    pharma: [
      { path: '/dashboard', name: 'Dashboard', icon: '📊' },
      { path: '/inventory', name: 'Inventory', icon: '📦' },
      { path: '/logout', name: 'Logout', icon: '🚪', action: onLogout }
    ]
  };

  const getMenuItems = () => {
    switch(userRole) {
      case 'admin':
        return menuItems.admin;
      case 'doctor':
        return menuItems.doctor;
      case 'pharma':
      case 'pharmaceutical_admin':
        return menuItems.pharma;
      default:
        return [];
    }
  };

  const handleMenuClick = (item) => {
    if (item.action) {
      item.action();
    }
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="toggle-btn" onClick={toggle}>
        ☰
      </button>
      <div className="menu-items">
        {getMenuItems().map((item, index) => (
          <div key={index}>
            {item.action ? (
              <button 
                className="menu-item logout-btn" 
                onClick={() => handleMenuClick(item)}
              >
                <span className="icon">{item.icon}</span>
                <span className="text">{item.name}</span>
              </button>
            ) : (
              <Link to={item.path} className="menu-item">
                <span className="icon">{item.icon}</span>
                <span className="text">{item.name}</span>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar; 