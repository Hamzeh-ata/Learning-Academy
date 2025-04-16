import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoles } from '@services/admin-services/roles.service';
import { selectAllRoles } from '@/slices/admin-slices/roles.slice';

export const useFetchRoles = () => {
  const dispatch = useDispatch();
  const roles = useSelector(selectAllRoles);
  const [fetchAttempted, setFetchAttempted] = useState(false);

  useEffect(() => {
    if (!roles.length && !fetchAttempted) {
      dispatch(fetchRoles());
      setFetchAttempted(true);
    }
  }, [roles, dispatch, fetchAttempted]);

  return roles;
};
