import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { ADMIN_ROLE } from '../constants';

export const RoleBasedRedirect = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      const isAdmin = userInfo.roles.includes(ADMIN_ROLE);
      if (isAdmin) {
        navigate('/admin-home');
      } else {
        navigate('/home');
      }
    }
  }, [userInfo, navigate]);

  return <Navigate to="/home" />;
};
