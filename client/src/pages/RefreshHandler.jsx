// src/pages/RefreshHandler.jsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const RefreshHandler = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      if (location.pathname === '/' || location.pathname === '/login') {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [location, navigate]);

  return <>{children}</>; // important to render the wrapped content!
};

export default RefreshHandler;
