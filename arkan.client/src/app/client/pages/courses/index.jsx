import emptyCoursesList from '@assets/images/empty-results.svg';
import { getCourseByFilters } from '@services/client-services/courses-filter.service';
import { CourseCard, CourseLoader } from '@shared/components';
import { selectFilteredCourses, selectLoader, selectPaginationData } from '@slices/client-slices/courses-filter.slice';
import { Paginator } from 'primereact/paginator';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CoursesFilter } from '@(client)/features/courses';

const Courses = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const courses = useSelector(selectFilteredCourses);
  const pagination = useSelector(selectPaginationData);
  const isLoading = useSelector(selectLoader);

  const [filters, setFilters] = useState({
    courseId: '',
    sortBy: '',
    sortOrder: 'asc',
    instructorId: '',
    studentId: '',
    courseName: '',
    categoryId: '',
    pageNumber: 1,
    pageSize: 10,
    universityId: '',
    packageId: '',
    type: '',
    first: 0
  });

  const filterString = useMemo(() => JSON.stringify(filters), [filters]);

  useEffect(() => {
    dispatch(getCourseByFilters(JSON.parse(filterString)));
  }, [filterString, dispatch]);

  const onPageChange = useCallback(
    (event) => {
      setFilters((f) => ({
        ...f,
        first: event.first,
        pageNumber: event.page + 1,
        pageSize: event.rows
      }));
    },
    [setFilters]
  );

  return (
    <div className="px-4 md:px-26 xl:px-40 py-4 xl:py-8 flex-1">
      <div className="flex flex-col gap-2">
        <div className="bg-white rounded-lg shadow-md my-2 p-6">
          <div className="flex justify-between flex-wrap">
            <h3 className="text-xl font-semibold">Courses List</h3>
            <p className="text-lg">{pagination.totalCount} Courses found</p>
          </div>
          <CoursesFilter filters={filters} setFilters={setFilters} />
        </div>
        <div className="bg-white rounded-lg shadow-md my-2 p-6">
          {isLoading && (
            <div className="flex justify-center h-full mb-2">
              <CourseLoader />
            </div>
          )}
          {!isLoading && !courses?.length && (
            <div className="flex flex-col justify-center items-center">
              <p className="text-gray-600 mb-2">No Result Found</p>
              <img src={emptyCoursesList} alt="empty courses" />
            </div>
          )}
          {!isLoading && !!courses?.length && (
            <>
              <div className="flex flex-wrap gap-4 justify-center px-4 pt-2 pb-2">
                {courses?.map((course) => (
                  <CourseCard
                    course={course}
                    key={course.id}
                    onClick={() => {
                      navigate(`/course/${course.id}`);
                    }}
                  />
                ))}
              </div>
              <div className="py-2 mt-4 border-t border-blue-grey-300">
                <Paginator
                  first={filters.first}
                  rows={filters.pageSize}
                  totalRecords={pagination.totalCount}
                  rowsPerPageOptions={[10, 20, 30]}
                  onPageChange={onPageChange}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
