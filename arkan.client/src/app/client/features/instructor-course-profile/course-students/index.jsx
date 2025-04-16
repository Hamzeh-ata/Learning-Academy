import { useDebounce } from '@uidotdev/usehooks';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CourseStudentsFilters } from './components/course-students-filter';
import { CourseStudentsList } from './components/course-students-list';
import { selectCourseStudents } from '@slices/client-slices/instructor-course-profile.slice';
import { fetchCourseStudents } from '@services/client-services/instructor-course-profile.service';

export const CourseStudents = ({ courseId }) => {
  const { students, pagination, isLoading } = useSelector(selectCourseStudents);
  const dispatch = useDispatch();

  const [filters, setFilters] = useState({
    courseId,
    studentName: '',
    pageNumber: 1,
    pageSize: 10,
    first: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const isFirstRender = useRef(true);
  const isFirstEffectRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setFilters((f) => ({ ...f, studentName: debouncedSearchTerm }));
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (isFirstEffectRender.current) {
      isFirstEffectRender.current = false;
      return;
    }
    dispatch(fetchCourseStudents(filters));
  }, [filters, dispatch]);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearInput = () => {
    setSearchTerm('');
  };

  const onPageChange = useCallback((event) => {
    setFilters((f) => ({ ...f, first: event.first, pageNumber: event.page + 1, pageSize: event.rows }));
  }, []);

  return (
    <div className="px-4 py-4 flex-1">
      <div className="flex flex-col gap-2">
        <CourseStudentsFilters
          searchTerm={searchTerm}
          handleChange={handleChange}
          pagination={pagination}
          clearInput={clearInput}
        />
        <CourseStudentsList
          students={students}
          filters={filters}
          onPageChange={onPageChange}
          pagination={pagination}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
