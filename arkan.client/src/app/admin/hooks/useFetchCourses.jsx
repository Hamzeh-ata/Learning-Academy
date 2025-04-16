import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '@/services/admin-services/catalog-management-services/course.service';
import { selectAllCourses } from '@/slices/admin-slices/catalog-management-slices/courses.slice';

export const useFetchCourses = () => {
  const dispatch = useDispatch();
  const courses = useSelector(selectAllCourses);

  useEffect(() => {
    dispatch(fetchCourses({ currentPage: 1, pageSize: 10 }));
  }, [dispatch]);

  return courses;
};
