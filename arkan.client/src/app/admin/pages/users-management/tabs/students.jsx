import {
  NonEnrolledCourses,
  StudentChangePassword,
  StudentCourses,
  StudentEntry,
  StudentInfo,
  StudentsList
} from '@/app/admin/features/users-management';
import {
  addStudentCourses,
  deleteStudentCourses,
  fetchNonEnrolledCourses,
  fetchStudentCourses,
  fetchStudentInformation,
  fetchStudents
} from '@/services/admin-services/user-services';
import { selectAllStudents, selectNonEnrolledCourses } from '@/slices/admin-slices/user-slices';
import { usePermissionCheck } from '@hooks';
import { Modal, SidebarPanel } from '@shared/components';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const MODAL_VIEWS = {
  NONE: 'NONE',
  STUDENT_ENTRY: 'STUDENT_ENTRY',
  NON_ENROLLED_COURSES: 'NON_ENROLLED_COURSES',
  STUDENT_INFO: 'STUDENT_INFO',
  STUDENT_COURSES: 'STUDENT_COURSES',
  CHANGE_PASSWORD: 'CHANGE_PASSWORD'
};

export const Students = () => {
  const dispatch = useDispatch();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const students = useSelector(selectAllStudents);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [modalView, setModalView] = useState(MODAL_VIEWS.NONE);
  const nonEnrolledCourses = useSelector(selectNonEnrolledCourses);
  const { edit } = usePermissionCheck('students');

  useEffect(() => {
    if (students?.length) {
      return;
    }
    dispatch(fetchStudents({ currentPage: 1, pageSize: 10 }));
  }, []);

  function resetForm() {
    setModalView(MODAL_VIEWS.NONE);
    setSelectedStudent(null);
  }

  const handleViewNonEnrolled = (student) => {
    setSelectedStudent(student);
    if (student && student.id) {
      dispatch(fetchNonEnrolledCourses({ UserId: student.id }));
      setModalView(MODAL_VIEWS.NON_ENROLLED_COURSES);
    }
  };
  const handleViewStudentInfo = (student) => {
    setSelectedStudent(student);
    setModalView(MODAL_VIEWS.STUDENT_INFO);
    dispatch(fetchStudentInformation(student.id));
  };

  const handleSelectedStudent = (student) => {
    setModalView(MODAL_VIEWS.STUDENT_ENTRY);
    setSelectedStudent(student);
  };

  const handleSubmit = () => {
    dispatch(addStudentCourses({ userId: selectedStudent.id, courseId: selectedCourses }));
    setSelectedCourses([]);
    resetForm();
  };

  const handleViewStudentCourses = (student) => {
    setSelectedStudent(student);
    if (student && student.id) {
      dispatch(fetchStudentCourses({ userId: student.id }));
      setModalView(MODAL_VIEWS.STUDENT_COURSES);
    }
  };

  const handleRemoveCourse = () => {
    dispatch(deleteStudentCourses({ userId: selectedStudent.id, courseId: selectedCourses }));
    setSelectedCourses([]);
    resetForm();
  };

  const handleChangePassword = (student) => {
    setSelectedStudent(student);
    setModalView(MODAL_VIEWS.CHANGE_PASSWORD);
  };

  return (
    <>
      <div className="mb-6 text-lg font-semibold text-gray-200">Students List</div>
      <StudentsList
        setShowNonEnrolled={handleViewNonEnrolled}
        students={students}
        setSelectedStudent={handleSelectedStudent}
        setStudentInfo={handleViewStudentInfo}
        setSelectedCourses={handleViewStudentCourses}
        handleChangePassword={handleChangePassword}
      />
      <Modal isOpen={modalView === MODAL_VIEWS.STUDENT_ENTRY} onClose={resetForm}>
        <StudentEntry student={selectedStudent} onSubmitted={resetForm} />
      </Modal>

      {modalView === MODAL_VIEWS.CHANGE_PASSWORD && (
        <Modal isOpen={true} onClose={() => setModalView(MODAL_VIEWS.NONE)}>
          <StudentChangePassword userId={selectedStudent?.id} onSubmitted={resetForm} />
        </Modal>
      )}

      <SidebarPanel
        isVisible={modalView === MODAL_VIEWS.NON_ENROLLED_COURSES && nonEnrolledCourses?.length}
        position={'top'}
        isFullScreen
        onHide={resetForm}
        isDismissible
        title={`${selectedStudent?.firstName} ${selectedStudent?.lastName}`}
        footer={
          edit && (
            <button onClick={handleSubmit} disabled={selectedCourses.length === 0} className={'btn'}>
              Add Selected Courses
            </button>
          )
        }
      >
        {modalView === MODAL_VIEWS.NON_ENROLLED_COURSES && nonEnrolledCourses?.length && (
          <NonEnrolledCourses
            nonEnrolledCourses={nonEnrolledCourses}
            userId={selectedStudent?.id}
            setSelectedCourses={setSelectedCourses}
            selectedCourses={selectedCourses}
          />
        )}
      </SidebarPanel>

      <SidebarPanel
        isVisible={modalView === MODAL_VIEWS.STUDENT_INFO && selectedStudent?.firstName?.length}
        position={'right'}
        onHide={resetForm}
        className="student-info-sidebar bg-gray-800"
        isDismissible
      >
        <StudentInfo student={selectedStudent} />
      </SidebarPanel>

      <SidebarPanel
        isVisible={modalView === MODAL_VIEWS.STUDENT_COURSES}
        position={'top'}
        isFullScreen
        onHide={resetForm}
        isDismissible
        title={`${selectedStudent?.firstName} ${selectedStudent?.lastName}`}
        footer={
          edit && (
            <button onClick={handleRemoveCourse} disabled={selectedCourses.length === 0} className={'btn'}>
              Remove Courses
            </button>
          )
        }
      >
        <StudentCourses
          selectedStudent={selectedStudent}
          setSelectedCourses={setSelectedCourses}
          userId={selectedStudent?.id}
          selectedCourses={selectedCourses}
        />
      </SidebarPanel>
    </>
  );
};
