import { useSelector } from 'react-redux';
import { STUDENT_ROLE } from '../constants';

export const useIsStudent = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo?.roles?.includes(STUDENT_ROLE);
};
