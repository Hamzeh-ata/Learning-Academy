import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRequests } from '@services/admin-services/change-password-requests.service';
import { selectAllRequests } from '@slices/admin-slices/change-password-requests.slice';

export const useFetchChangePasswordRequests = () => {
  const dispatch = useDispatch();
  const requests = useSelector(selectAllRequests);
  const [fetchAttempted, setFetchAttempted] = useState(false);

  useEffect(() => {
    if (!requests.length && !fetchAttempted) {
      dispatch(fetchRequests());
      setFetchAttempted(true);
    }
  }, [requests, dispatch, fetchAttempted]);

  return requests;
};
