import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if token or userInfo exists in localStorage
  const token = localStorage.getItem('token') || localStorage.getItem('userInfo');

  if (!token) {
    // If not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;