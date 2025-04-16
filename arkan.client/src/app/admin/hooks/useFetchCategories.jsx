import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '@/services/admin-services/catalog-management-services/category.service';
import { selectAllCategories } from '@/slices/admin-slices/catalog-management-slices/category.slice';

export const useFetchCategories = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectAllCategories);
  const [fetchAttempted, setFetchAttempted] = useState(false);

  useEffect(() => {
    if (!categories.length && !fetchAttempted) {
      dispatch(fetchCategories());
      setFetchAttempted(true);
    }
  }, [categories, dispatch, fetchAttempted]);

  return categories;
};
