import { useSelector } from 'react-redux';
import { selectUserInfo } from '@slices/auth/auth.slice';
import { useEffect, useState } from 'react';

export const useIsAuthenticated = () => {
  const userInfo = useSelector(selectUserInfo);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!userInfo?.isAuthenticated) {
      setIsAuthenticated(false);
      return;
    }
    setIsAuthenticated(true);
  }, [userInfo]);

  return isAuthenticated;
};
