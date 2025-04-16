import emptyCoursesList from '@assets/images/empty-results.svg';
import { CourseLoader } from '@shared/components';
import { formatDate } from '@utils/date-format';
import { getImageFullPath } from '@utils/image-path';
import { Paginator } from 'primereact/paginator';

export const CourseStudentsList = ({ students, filters, onPageChange, pagination, isLoading }) => (
  <div className="bg-white rounded-lg shadow-md my-2 p-6">
    {isLoading && (
      <div className="flex justify-center h-full mb-2">
        <CourseLoader />
      </div>
    )}
    {!isLoading && !students?.length && (
      <div className="flex flex-col justify-center items-center">
        <p className="text-gray-600 mb-2">No Result Found</p>
        <img src={emptyCoursesList} alt="empty courses" />
      </div>
    )}
    {!isLoading && !!students?.length && (
      <>
        <div className="flex flex-wrap gap-3 justify-center pt-2 overflow-y-auto max-h-[calc(100vh-300px)] pb-2">
          {students?.map((student) => (
            <div
              className="flex flex-col rounded-lg bg-white shadow-sm border shadow-slate-300 w-[275px] animate-fade-up"
              key={student.id}
            >
              <img src={getImageFullPath(student.image)} alt={student.name} className=" bg-slate-100 w-[340px] h-40" />
              <div className="p-4 pt-2 pb-1 text-gray-600">
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">{student.name}</h3>
                <p className="text-md text-gray-500 mb-4 line-clamp-3">
                  Joined at {formatDate(student.enrollmentDate)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="py-2 border-t border-blue-grey-300">
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
);
