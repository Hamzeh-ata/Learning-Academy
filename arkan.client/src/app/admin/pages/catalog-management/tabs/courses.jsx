import { fetchCourses, getCourseById } from '@/services/admin-services/catalog-management-services/course.service';
import { PlusIcon, SidebarPanel } from '@shared/components';
import { selectAllCourses } from '@/slices/admin-slices/catalog-management-slices/courses.slice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePermissionCheck } from '@hooks';
import { CoursesEntry, CoursesList } from '@/app/admin/features/catalog-management';
import { useFetchCategories, useFetchInstructors } from '@/app/admin/hooks';

const Courses = () => {
  const dispatch = useDispatch();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { create } = usePermissionCheck('courses');

  const courses = useSelector(selectAllCourses);

  useEffect(() => {
    if (courses?.length) {
      return;
    }
    dispatch(fetchCourses({ currentPage: 1, pageSize: 10 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFetchCategories();
  useFetchInstructors();

  const resetForm = () => {
    setSelectedCourse(null);
    setIsModalOpen(false);
  };

  const handleEditCourse = (course) => {
    dispatch(getCourseById(course.id))
      .unwrap()
      .then((data) => {
        setSelectedCourse(data);
        setIsModalOpen(true);
      })
      .catch((error) => console.error('Failed to fetch course details:', error));
  };

  const CoursesListHeader = () => (
    <div className="flex justify-between mb-6 text-lg font-semibold text-gray-200">
      <div>Courses List</div>
      {create && (
        <button
          onClick={() => {
            setIsModalOpen(true);
          }}
          className="text-orange-500"
        >
          <PlusIcon />
        </button>
      )}
    </div>
  );

  return (
    <>
      <CoursesListHeader />
      <CoursesList courses={courses} setSelectedCourse={handleEditCourse} />
      <SidebarPanel
        isVisible={isModalOpen}
        position={'top'}
        isFullScreen
        onHide={resetForm}
        className="course-sidebar"
        isDismissible
        title={`${selectedCourse ? 'Update' : 'Add'} Course`}
      >
        <CoursesEntry course={selectedCourse} onSubmitted={resetForm} />
      </SidebarPanel>
    </>
  );
};

export default Courses;
