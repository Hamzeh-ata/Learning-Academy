import { InstructorsFilter } from '@(client)/features/instructors';
import emptyCoursesList from '@assets/images/empty-results.svg';
import { getInstructorsByFilters } from '@services/client-services/instructor.service';
import { CourseLoader, InstructorCard } from '@shared/components';
import { selectClientInstructors, selectLoader, selectPaginationData } from '@slices/client-slices/instructor.slice';
import { Paginator } from 'primereact/paginator';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Instructors = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(selectLoader);
  const pagination = useSelector(selectPaginationData);
  const instructors = useSelector(selectClientInstructors);

  const [filters, setFilters] = useState({
    sortBy: '',
    sortOrder: 'asc',
    name: '',
    pageNumber: 1,
    pageSize: 10,
    first: 0
  });

  useEffect(() => {
    dispatch(getInstructorsByFilters(filters));
  }, [filters, dispatch]);

  function onPageChange(event) {
    setFilters((f) => ({ ...f, first: event.first, pageNumber: event.page + 1, pageSize: event.rows }));
  }

  return (
    <div className="px-4 md:px-26 xl:px-40 py-4 xl:py-8 flex-1">
      <div className="flex flex-col gap-2">
        <div className="bg-white rounded-lg shadow-md my-2 p-6">
          <div className="flex justify-between flex-wrap">
            <h3 className="text-xl font-semibold">Instructors List</h3>
            <p className="text-lg">{pagination.totalCount} Instructors found</p>
          </div>
          <InstructorsFilter filters={filters} setFilters={setFilters} />
        </div>
        <div className="bg-white rounded-lg shadow-md my-2 p-6">
          {isLoading && (
            <div className="flex justify-center h-full mb-2">
              <CourseLoader />
            </div>
          )}
          {!isLoading && !instructors?.length && (
            <div className="flex flex-col justify-center items-center">
              <p className="text-gray-600 mb-2">No Result Found</p>
              <img src={emptyCoursesList} alt="empty instructors" />
            </div>
          )}
          {!isLoading && !!instructors?.length && (
            <>
              <div className="flex flex-wrap gap-3 justify-center pt-2 pe-4 md:pe-0">
                {instructors?.map((instructor) => (
                  <InstructorCard
                    key={instructor.id}
                    instructor={instructor}
                    onClick={() => {
                      navigate(`/instructor/${instructor.id}`);
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

export default Instructors;
