import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUniversities } from '@/services/admin-services/catalog-management-services/universities.service';
import { selectAllUniversities } from '@/slices/admin-slices/catalog-management-slices/university.slice';

export const useFetchUniversities = () => {
  const dispatch = useDispatch();
  const universities = useSelector(selectAllUniversities);
  const [fetchAttempted, setFetchAttempted] = useState(false);

  useEffect(() => {
    if (!universities.length && !fetchAttempted) {
      dispatch(fetchUniversities({ currentPage: 1, pageSize: 10 }));
      setFetchAttempted(true);
    }
  }, [universities, dispatch, fetchAttempted]);

  return universities;
};
