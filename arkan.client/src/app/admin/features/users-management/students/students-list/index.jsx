import { deleteStudent, fetchStudents } from '@/services/admin-services/user-services';
import { selectStudentsLoading, selectStudentsPaginationData } from '@/slices/admin-slices/user-slices';
import { usePermissionCheck } from '@hooks';
import alertService from '@services/alert/alert.service';
import { Loader } from '@shared/components';
import { Dropdown } from 'primereact/dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { StudentTitle } from './components/student-title';

export const StudentsList = ({
  students,
  setSelectedStudent,
  setShowNonEnrolled,
  setStudentInfo,
  setSelectedCourses,
  handleChangePassword
}) => {
  const dispatch = useDispatch();
  const pagination = useSelector(selectStudentsPaginationData);
  const isLoading = useSelector(selectStudentsLoading);

  const { edit, delete: canDelete } = usePermissionCheck('students');

  const actions = [
    {
      name: 'Edit',
      value: 'edit',
      disabled: !edit
    },
    {
      name: 'Delete',
      value: 'delete',
      disabled: !canDelete
    },
    {
      name: 'Non-Enrolled Courses',
      value: 'nonEnrolled'
    },
    {
      name: 'View Student Courses',
      value: 'viewCourses'
    },
    {
      name: 'Change Password',
      value: 'changePassword',
      disabled: !edit
    }
  ];

  const handlePageChange = (newPage) => {
    dispatch(fetchStudents({ currentPage: newPage, pageSize: pagination.pageSize }));
  };

  const handleDelete = (student) => {
    alertService.showConfirmation({
      title: 'Confirm Delete',
      body: 'Are you sure you want delete this student',
      callback: () => dispatch(deleteStudent(student))
    });
  };

  const handleActionChange = (value, student) => {
    if (value === 'edit') {
      setSelectedStudent(student);
    } else if (value === 'delete') {
      handleDelete(student);
    } else if (value === 'nonEnrolled') {
      setShowNonEnrolled(student);
    } else if (value === 'viewInfo') {
      setStudentInfo(student);
    } else if (value === 'viewCourses') {
      setSelectedCourses(student);
    } else if (value === 'changePassword') {
      handleChangePassword(student);
    }
  };

  return (
    <div>
      <div>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone NO.</th>
              <th>Courses Count</th>
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
            {students?.map((student) => (
              <tr key={student.id}>
                <td>
                  <StudentTitle
                    title={student.firstName + ' ' + student.lastName}
                    image={student.image}
                    id={student.id}
                  />
                </td>
                <td>{student.email}</td>
                <td>{student.phoneNumber}</td>
                <td>{student.coursesCount}</td>
                <td>
                  <div className="field">
                    <Dropdown
                      onChange={(e) => {
                        handleActionChange(e.value, student);
                      }}
                      options={actions.filter((e) => !e.disabled)}
                      optionLabel="name"
                      placeholder="Select Action"
                      className="w-full md:w-14rem"
                    />
                  </div>
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
          Shown Students : {students.length} / {pagination.totalCount}
        </span>
      </div>
    </div>
  );
};
