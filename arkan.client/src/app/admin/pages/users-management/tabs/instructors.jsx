import {
  InstructorChangePassword,
  InstructorCourses,
  InstructorEntry,
  InstructorsList
} from '@(admin)/features/users-management';
import { useFetchInstructors } from '@(admin)/hooks';
import { addInstructorCourses, fetchInstructorInformation } from '@/services/admin-services/user-services';
import { usePermissionCheck } from '@hooks';
import alertService from '@services/alert/alert.service';
import { Modal, SidebarPanel } from '@shared/components';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

const MODAL_VIEWS = {
  NONE: 'NONE',
  INSTRUCTOR_ENTRY: 'INSTRUCTOR_ENTRY',
  CHANGE_PASSWORD: 'CHANGE_PASSWORD',
  INSTRUCTOR_COURSES: 'INSTRUCTOR_ENTRY'
};

export const Instructors = () => {
  const dispatch = useDispatch();
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [modalView, setModalView] = useState(MODAL_VIEWS.NONE);
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const { edit } = usePermissionCheck('instructors');

  const instructors = useFetchInstructors();

  const handleChangePassword = (instructor) => {
    setSelectedInstructor(instructor);
    setModalView(MODAL_VIEWS.CHANGE_PASSWORD);
  };

  const handleEditInstructor = (instructor) => {
    dispatch(fetchInstructorInformation(instructor))
      .unwrap()
      .then((data) => {
        setSelectedInstructor(data);
        setModalView(MODAL_VIEWS.ADMIN_ENTRY);
      })
      .catch((error) => console.error('Failed to fetch instructor details:', error));
  };

  const handleViewInstructorCourses = (instructor) => {
    setSelectedInstructor(instructor);
    setModalView(MODAL_VIEWS.INSTRUCTOR_COURSES);
  };

  const submitInstructorCourses = () => {
    if (selectedInstructor && selectedCourses.length) {
      try {
        dispatch(
          addInstructorCourses({
            userId: selectedInstructor.id,
            coursesIds: selectedCourses.map((e) => e.id)
          })
        );
        alertService.showToast({ type: 'success', title: 'Course(s) Added Successfully' });
      } catch (err) {
        console.log(err);
      } finally {
        resetForm();
      }
    }
  };

  const resetForm = () => {
    setSelectedInstructor(null);
    setSelectedCourses([]);
    setModalView(MODAL_VIEWS.NONE);
    setTabIndex(0);
  };

  return (
    <>
      <div className="mb-6 text-lg font-semibold text-gray-200">Instructors List</div>
      <InstructorsList
        instructors={instructors}
        handleChangePassword={handleChangePassword}
        setViewInstructorCourses={handleViewInstructorCourses}
        setSelectedInstructor={handleEditInstructor}
      />

      {modalView === MODAL_VIEWS.CHANGE_PASSWORD && (
        <Modal isOpen={modalView === MODAL_VIEWS.CHANGE_PASSWORD} onClose={resetForm}>
          <InstructorChangePassword userId={selectedInstructor?.id} onSubmitted={resetForm} />
        </Modal>
      )}

      {modalView === MODAL_VIEWS.ADMIN_ENTRY && (
        <SidebarPanel
          isVisible
          position={'right'}
          onHide={resetForm}
          isDismissible
          title={`${selectedInstructor ? 'Update' : 'Add'} Instructor`}
        >
          <InstructorEntry instructor={selectedInstructor} onSubmitted={resetForm} />
        </SidebarPanel>
      )}

      {modalView === MODAL_VIEWS.INSTRUCTOR_COURSES && (
        <SidebarPanel
          isVisible
          isFullScreen
          position={'top'}
          onHide={resetForm}
          className="instructor-sidebar"
          isDismissible
          footer={
            <div className="flex gap-2">
              <button className="text-red-400 py-3 px-6" onClick={resetForm}>
                Cancel
              </button>
              {tabIndex === 1 && edit && (
                <button className="btn" onClick={submitInstructorCourses} disabled={!selectedCourses.length}>
                  Submit
                </button>
              )}
            </div>
          }
        >
          <InstructorCourses
            instructor={selectedInstructor}
            onTabClick={setTabIndex}
            selectedCourses={selectedCourses}
            setSelectedCourses={setSelectedCourses}
          />
        </SidebarPanel>
      )}
    </>
  );
};
