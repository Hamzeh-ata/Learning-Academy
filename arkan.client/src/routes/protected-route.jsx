import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ADMIN_ROLE } from '../constants';

export const ProtectedRoute = ({ isAdminRoute = false }) => {
  const { userToken, userInfo } = useSelector((state) => state.auth);
  const isAdmin = userInfo?.roles.includes(ADMIN_ROLE);

  if (!userToken) {
    return <Navigate to="/login" replace />;
  }

  // If it's an admin route and the user is not an admin, redirect to unauthorized
  if (isAdminRoute && !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
