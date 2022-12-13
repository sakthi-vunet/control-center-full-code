import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';

export const PrivateRoute = () => {
  // determine if authorized, from context
  const user = useContext(AuthContext);

  // If authorized, return an outlet that will render child elements
  // If not, return element that will navigate to login page
  return user ? <Outlet /> : <Navigate to="/app/controlcenter/login" />;
};
