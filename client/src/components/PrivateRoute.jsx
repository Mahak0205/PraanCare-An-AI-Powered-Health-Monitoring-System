// src/components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem('user-info'));
  const token = userInfo?.token;

  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;