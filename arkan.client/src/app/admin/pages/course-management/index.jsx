import { TabComponent, TabsCard } from '@shared/components';
import { Chapters } from './tabs/chapters';
import { Lessons } from './tabs/lessons';
import { Quizzes } from './tabs/quizzes';
import StudentsChapters from './tabs/student-chapters';
import QuizAttempts from './tabs/quiz-attempts';
import './course-management.css';

const CourseManagement = () => (
  <TabsCard title="Course Management">
    <TabComponent title="Chapters List" tabTitle={'Chapters'}>
      <Chapters />
    </TabComponent>
    <TabComponent title="Lessons List" tabTitle={'Lessons'}>
      <Lessons />
    </TabComponent>
    <TabComponent tabTitle={'Quizzes'}>
      <Quizzes />
    </TabComponent>
    <TabComponent tabTitle={'Chapter Students'} title="Chapter Students">
      <StudentsChapters />
    </TabComponent>
    <TabComponent tabTitle="Quiz Attempts" title="Quiz Attempts">
      <QuizAttempts />
    </TabComponent>
  </TabsCard>
);
export default CourseManagement;
