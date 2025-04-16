import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllChapters } from '@/slices/admin-slices/course-management-slices/chapters.slice';
import { selectAllLessons } from '@/slices/admin-slices/course-management-slices/lessons.slice';
import { fetchChapters } from '@/services/admin-services/course-management-services/chapters.service';
import { fetchLessons } from '@/services/admin-services/course-management-services/lessons.service';
import { FeatherIcon, SidebarPanel, Loader } from '@shared/components';
import { getQuizByLessonId } from '@/services/admin-services/course-management-services/quizzes.service';
import { selectQuiz, selectLoading } from '@/slices/admin-slices/course-management-slices/quizzes.slice';
import { Button } from 'primereact/button';
import { usePermissionCheck } from '@hooks';
import { SelectChapter, SelectCourse, SelectLesson } from '@/app/admin/features/course-management';
import { useFetchCourses } from '@/app/admin/hooks';
import { QuizDisplay, QuizEntry } from '@/app/admin/features/course-management/quizzes';

export const Quizzes = () => {
  const dispatch = useDispatch();
  const [selectedCourseId, setSelectedCourseId] = useState();
  const [selectedChapterId, setSelectedChapterId] = useState();
  const [selectedLessonId, setSelectedLessonId] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const courses = useFetchCourses();
  const chapters = useSelector(selectAllChapters);
  const lessons = useSelector(selectAllLessons);
  let quizObject = useSelector(selectQuiz);
  const { create } = usePermissionCheck('quizzes');
  const isLoading = useSelector(selectLoading);

  const handleChapterCourse = (id) => {
    dispatch(fetchChapters({ currentPage: 1, pageSize: 10, courseId: id }));
    setSelectedCourseId(id);
    setSelectedChapterId(null);
    setSelectedLessonId(null);
  };

  const handleLessonChapter = (id) => {
    dispatch(fetchLessons({ currentPage: 1, pageSize: 10, chapterId: id }));
    setSelectedChapterId(id);
    setSelectedLessonId(null);
  };

  const handleSelectedLesson = (id) => {
    setSelectedLessonId(id);
    dispatch(getQuizByLessonId(id));
  };

  const handleEditQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    quizObject = null;
    setIsModalOpen(false);
    setSelectedQuiz(null);
    dispatch(getQuizByLessonId(selectedLessonId));
  };

  const QuizHeader = () => (
    <div className="flex gap-2 mb-6 text-lg font-semibold text-gray-200">
      <span>
        <FeatherIcon size={35} className="text-orange-400" name="Sliders" />
      </span>
      <span>Quiz Management</span>
    </div>
  );

  return (
    <div>
      <QuizHeader />
      <div className="flex flex-wrap gap-2 items-center">
        <SelectCourse
          courses={courses}
          selectedCourseId={selectedCourseId}
          setSelectedCourseId={handleChapterCourse}
          isAddBtnVisible={false}
          containerClassName="!w-1/3"
        />

        {selectedCourseId && !!chapters?.length && (
          <SelectChapter
            chapters={chapters}
            courseId={selectedCourseId}
            selectedChapterId={selectedChapterId}
            setSelectedChapterId={handleLessonChapter}
            showAddLesson={false}
            containerClassName="!w-1/3"
            className="w-full max-w-full"
          />
        )}
        {selectedCourseId && !chapters?.length && (
          <div className="flex items-center gap-4">
            <p className="text-center">This course does not belong to any Chapter! </p>
          </div>
        )}

        {selectedCourseId && selectedChapterId && !lessons?.length && (
          <div className="flex items-center gap-4">
            <p className="text-center">This chapter does not belong to any Lesson! </p>
          </div>
        )}

        {selectedCourseId && selectedChapterId && !!lessons?.length && (
          <SelectLesson
            selectedLessonId={selectedLessonId}
            setSelectedLessonId={handleSelectedLesson}
            lessons={lessons}
            chapterId={selectedChapterId}
            containerClassName="!w-1/4"
          />
        )}
      </div>
      {selectedCourseId && selectedChapterId && selectedLessonId && !quizObject?.id && (
        <div className="flex items-center gap-2">
          <span className="text-gray-300">This lesson does not have a quiz:</span>
          {create && (
            <Button className="text-primary" onClick={() => setIsModalOpen(true)}>
              Add Quiz
            </Button>
          )}
        </div>
      )}
      {selectedCourseId && selectedChapterId && selectedLessonId && !!quizObject?.id && (
        <>
          {isLoading && (
            <div className="flex justify-center">
              <Loader />
            </div>
          )}
          {!isLoading && (
            <div>
              <span className="text-gray-300">Quiz:</span>
              <QuizDisplay quiz={quizObject} editQuiz={handleEditQuiz} />
            </div>
          )}
        </>
      )}
      <SidebarPanel
        isVisible={isModalOpen}
        position={'right'}
        onHide={resetForm}
        isDismissible
        title={`${selectedQuiz ? 'Update' : 'Add'} Quiz`}
      >
        <QuizEntry quiz={selectedQuiz} onSubmitted={resetForm} lessonId={selectedLessonId} />
      </SidebarPanel>
    </div>
  );
};
