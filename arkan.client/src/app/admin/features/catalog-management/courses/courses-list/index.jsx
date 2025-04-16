import { useDispatch, useSelector } from 'react-redux';
import { selectLoading, selectPaginationData } from '@/slices/admin-slices/catalog-management-slices/courses.slice';
import { fetchCourses, deleteCourse } from '@/services/admin-services/catalog-management-services/course.service';
import alertService from '@services/alert/alert.service';
import { Loader } from '@shared/components';
import { CourseTitle } from '../components/course-title';
import { CourseActions } from '../components/course-actions';

export const CoursesList = ({ courses, setSelectedCourse }) => {
  const dispatch = useDispatch();
  const pagination = useSelector(selectPaginationData);
  const isLoading = useSelector(selectLoading);

  const handlePageChange = (newPage) => {
    dispatch(fetchCourses({ currentPage: newPage, pageSize: 10 }));
  };

  const handleDelete = (course) => {
    alertService.showConfirmation({
      title: 'Confirm Delete',
      body: 'Are you sure you want to delete this course',
      callback: () => dispatch(deleteCourse(course))
    });
  };

  return (
    <div>
      <div>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Discount Price</th>
              <th>Instructor Name</th>
              <th>Students count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan="7" className="text-center p-10 h-28">
                  <Loader />
                </td>
              </tr>
            )}
            {courses?.map((course) => (
              <tr key={course.id}>
                <td>
                  <CourseTitle title={course.name} image={course.image} id={course.id} />
                </td>
                <td className="text-center">{course.price}</td>
                <td className="text-center">{course.discountPrice || 0}</td>
                <td>{course.instructorName || '---'}</td>
                <td className="text-center">{course.studentsCount}</td>
                <td>
                  <CourseActions setSelectedCourse={setSelectedCourse} handleDelete={handleDelete} course={course} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <button
          className={`px-4 py-2 ${pagination.currentPage === 1 ? 'text-gray-500 cursor-no-drop' : 'text-gray-200'}`}
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
        >
          Previous
        </button>

        <button
          className={`px-4 py-2 ${!pagination.hasNextPage ? 'text-gray-500 cursor-no-drop' : 'text-gray-200'}`}
          onClick={() => handlePageChange(pagination?.currentPage + 1)}
          disabled={!pagination.hasNextPage}
        >
          Next
        </button>
        <span>
          Page : {pagination.currentPage} / {pagination.totalPages}
        </span>
        <span className="ms-4">
          Shown Courses : {courses.length} / {pagination.totalCount}
        </span>
      </div>
    </div>
  );
};
