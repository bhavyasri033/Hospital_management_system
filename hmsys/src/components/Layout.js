import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './Layout.css';

const Layout = ({ userRole, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggle={toggleSidebar} 
        userRole={userRole}
        onLogout={handleLogout}
      />
      <Navbar userRole={userRole} />
      <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout; 