import { useSelector } from 'react-redux';
import { ADMIN_ROLE } from '../constants';

export const useIsAdmin = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo?.roles?.includes(ADMIN_ROLE);
};
