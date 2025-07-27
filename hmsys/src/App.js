import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import Inventory from './pages/Inventory';
import './App.css';
import axios from 'axios';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('admin');
  const [userData, setUserData] = useState(null);

  // Backend login logic
  const handleLogin = async (loginData) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email: loginData.email,
        password: loginData.password
      });
      if (res.data && res.data.user) {
        setIsAuthenticated(true);
        setUserRole(res.data.user.role);
        setUserData(res.data.user);
      } else {
        alert('Login failed. Please try again.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('admin');
    setUserData(null);
  };

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <Login onLogin={handleLogin} />
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <Register />
          }
        />
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
            <Layout userRole={userRole} onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard userRole={userRole} userData={userData} />} />
          <Route
            path="patients"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Patients />
              </ProtectedRoute>
            }
          />
          <Route
            path="doctors"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Doctors />
              </ProtectedRoute>
            }
          />
          <Route
            path="appointments"
            element={
              <ProtectedRoute allowedRoles={['admin', 'doctor']}>
                <Appointments userRole={userRole} userData={userData} />
              </ProtectedRoute>
            }
          />
          <Route
            path="inventory"
            element={
              <ProtectedRoute allowedRoles={['admin', 'pharma', 'pharmaceutical_admin']}>
                <Inventory userRole={userRole} />
              </ProtectedRoute>
            }
          />
          <Route 
            path="logout" 
            element={
              <Navigate to="/login" replace />
            } 
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App; 