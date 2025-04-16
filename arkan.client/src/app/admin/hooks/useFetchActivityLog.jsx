import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivitesLog } from '@/services/admin-services/activity-log.service';
import { selectAllActivites } from '@/slices/admin-slices/activity-log.slice';

export const useFetchActivityLog = () => {
  const dispatch = useDispatch();
  const activites = useSelector(selectAllActivites);
  const [fetchAttempted, setFetchAttempted] = useState(false);

  useEffect(() => {
    if (!activites.length && !fetchAttempted) {
      dispatch(fetchActivitesLog({ currentPage: 1, pageSize: 10 }));
      setFetchAttempted(true);
    }
  }, [activites, dispatch, fetchAttempted]);

  return activites;
};
