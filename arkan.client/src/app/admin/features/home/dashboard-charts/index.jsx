import { DROP_DOWN_TYPES } from '@/constants';
import { useDropdownData } from '@/hooks';
import { CourseStatisticsCard } from '..';
import './index.css';
import { InstructorStatisticsCard } from './instructor-statistics-card';
import { StudentStatisticsCard } from './student-statistics-card';
import { OrderStatisticsCard } from './order-statistics-card';

export function DashboardCharts() {
  const { courses, instructors, students } = useDropdownData([
    DROP_DOWN_TYPES.Courses,
    DROP_DOWN_TYPES.Instructors,
    DROP_DOWN_TYPES.Students
  ]);
  return (
    <div className="flex flex-wrap gap-2 dashboard-charts justify-center">
      <CourseStatisticsCard courses={courses} />
      <StudentStatisticsCard key={students?.length + 2} students={students} />
      <InstructorStatisticsCard instructors={instructors} />
      <OrderStatisticsCard />
    </div>
  );
}
