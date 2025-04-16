import classNames from 'classnames';
import { useState } from 'react';
import { CourseChaptersEditable } from '../course-chapters';
import { CourseStudents } from '../course-students';

export const CourseContent = ({
  courseData,
  courseChapters,
  onAddChapter,
  onEditChapter,
  onAddLesson,
  onEditLesson,
  handleDeleteChapter,
  handleDeleteLesson,
  onAddQuiz,
  onEditQuiz,
  onDeleteQuiz
}) => {
  const [activeTab, setActiveTab] = useState('content');

  return (
    <div className="w-full lg:w-1/2 text-center relative justify-center">
      <div className="pb-4">
        <h3 className="font-semibold py-4 text-arkan text-lg">Course Description</h3>
        <p className="text-center text-blue-grey-600">{courseData.description}</p>
      </div>
      <div className="flex justify-center gap-10 my-10">
        <button
          onClick={() => setActiveTab('content')}
          className={classNames(
            'text-arkan hover:text-arkan-dark underline-offset-4 decoration-slate-500 decoration-2 font-semibold',
            {
              underline: activeTab === 'content'
            }
          )}
        >
          Course Management
        </button>
        <button
          className={classNames(
            'text-arkan hover:text-arkan-dark underline-offset-4 decoration-slate-500 decoration-2 font-semibold',
            {
              underline: activeTab !== 'content'
            }
          )}
          onClick={() => setActiveTab('students')}
        >
          Course Students
        </button>
      </div>
      {activeTab === 'content' && (
        <CourseChaptersEditable
          chapters={courseChapters}
          onAddChapter={onAddChapter}
          onEditChapter={onEditChapter}
          onAddLesson={onAddLesson}
          onDeleteChapter={handleDeleteChapter}
          onEditLesson={onEditLesson}
          onDeleteLesson={handleDeleteLesson}
          onAddQuiz={onAddQuiz}
          onEditQuiz={onEditQuiz}
          onDeleteQuiz={onDeleteQuiz}
        />
      )}
      {activeTab === 'students' && <CourseStudents courseId={courseData.id} />}
    </div>
  );
};
