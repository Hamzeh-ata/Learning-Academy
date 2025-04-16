import { deleteInstructor, fetchInstructors } from '@/services/admin-services/user-services';
import { selectInstructorsLoading, selectInstructorsPaginationData } from '@/slices/admin-slices/user-slices';
import alertService from '@services/alert/alert.service';
import { Loader } from '@shared/components';
import { useDispatch, useSelector } from 'react-redux';
import { InstructorActions } from './instructor-actions';
import { InstructorTitle } from './instructor-title';

export const InstructorsList = ({
  instructors,
  setSelectedInstructor,
  setViewInstructorCourses,
  handleChangePassword
}) => {
  const dispatch = useDispatch();
  const pagination = useSelector(selectInstructorsPaginationData);
  const isLoading = useSelector(selectInstructorsLoading);

  const handlePageChange = (newPage) => {
    dispatch(fetchInstructors({ currentPage: newPage, pageSize: 10 }));
  };

  const handleDelete = (instructor) => {
    alertService.showConfirmation({
      title: 'Confirm Delete',
      body: 'Are you sure you want to delete this instructor',
      callback: () => dispatch(deleteInstructor(instructor))
    });
  };

  return (
    <div>
      <div>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan="4" className="text-center p-10 h-28">
                  <Loader />
                </td>
              </tr>
            )}
            {instructors?.map((instructor) => (
              <tr key={instructor.id}>
                <td>
                  <InstructorTitle
                    title={`${instructor.firstName} ${instructor.lastName}`}
                    image={instructor.image}
                    id={instructor.id}
                  />
                </td>
                <td>{instructor.email}</td>

                <td>{instructor.phoneNumber || '---'}</td>
                <td>
                  <InstructorActions
                    setViewInstructorCourses={setViewInstructorCourses}
                    setSelectedInstructor={setSelectedInstructor}
                    handleDelete={handleDelete}
                    handleChangePassword={handleChangePassword}
                    instructor={instructor}
                  />
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
          Shown Instructors : {instructors.length} / {pagination.totalCount}
        </span>
      </div>
    </div>
  );
};
