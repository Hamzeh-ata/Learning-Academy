import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInstructors } from '@/services/admin-services/user-services/instructor.service';
import { selectAllInstructors } from '@/slices/admin-slices/user-slices/instructor.slice';

export const useFetchInstructors = () => {
  const dispatch = useDispatch();
  const instructors = useSelector(selectAllInstructors);
  const [fetchAttempted, setFetchAttempted] = useState(false);

  useEffect(() => {
    if (!instructors.length && !fetchAttempted) {
      dispatch(fetchInstructors({ currentPage: 1, pageSize: 10 }));
      setFetchAttempted(true);
    }
  }, [instructors, dispatch, fetchAttempted]);

  return instructors;
};
