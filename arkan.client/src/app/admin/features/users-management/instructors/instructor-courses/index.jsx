import { TabsCard, TabComponent } from '@shared/components';
import { CourseCard } from './course-card';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllCourses } from '@/slices/admin-slices/catalog-management-slices/courses.slice';
import { fetchCourses } from '@/services/admin-services/catalog-management-services/course.service';

export const InstructorCourses = ({ instructor, onTabClick, setSelectedCourses, selectedCourses }) => {
  const dispatch = useDispatch();
  const courses = useSelector(selectAllCourses);
  const [noneInstructorCourses, setNoneInstructorCourses] = useState([]);

  useEffect(() => {
    dispatch(fetchCourses({ currentPage: 1, pageSize: 250 }));
  }, []);

  useEffect(() => {
    if (courses?.length) {
      const instructorCoursesIds = instructor.instructorCourses.map((e) => e.id);
      const noneInstructorCourses = courses.filter((e) => !instructorCoursesIds.includes(e.id));
      setNoneInstructorCourses(noneInstructorCourses);
    }
  }, [courses, instructor]);

  const handleCourseSelect = (course) => {
    if (selectedCourses.find((selectedCourse) => selectedCourse.id === course.id)) {
      setSelectedCourses(selectedCourses.filter((selectedCourse) => selectedCourse.id !== course.id));
    } else {
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  return (
    <TabsCard title={`${instructor.firstName} ${instructor.lastName}`} onTabClick={onTabClick}>
      <TabComponent tabTitle="My Courses">
        <div className="flex flex-wrap gap-6 justify-center p-4">
          {instructor.instructorCourses && instructor.instructorCourses.length > 0 ? (
            instructor.instructorCourses.map((course) => <CourseCard key={course.id} course={course} />)
          ) : (
            <p className="text-gray-500">No courses found</p>
          )}
        </div>
      </TabComponent>
      <TabComponent tabTitle="Other Courses">
        <div className="flex flex-wrap gap-6 justify-center p-4">
          {noneInstructorCourses && noneInstructorCourses.length > 0 ? (
            noneInstructorCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                showSelect
                onSelect={handleCourseSelect}
                isSelected={selectedCourses.some((selectedCourse) => selectedCourse.id === course.id)}
              />
            ))
          ) : (
            <p className="text-gray-500">No courses found</p>
          )}
        </div>
      </TabComponent>
    </TabsCard>
  );
};
