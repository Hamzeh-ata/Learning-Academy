import { QuizAttemptsList, SelectChapter, SelectCourse, SelectLesson } from '@/app/admin/features/course-management';
import { useFetchCourses } from '@/app/admin/hooks';
import { fetchChapters } from '@/services/admin-services/course-management-services/chapters.service';
import { fetchLessons } from '@/services/admin-services/course-management-services/lessons.service';
import { getQuizIdByLessonId } from '@/services/admin-services/course-management-services/quizzes.service';
import { selectAllChapters } from '@/slices/admin-slices/course-management-slices/chapters.slice';
import { selectAllLessons } from '@/slices/admin-slices/course-management-slices/lessons.slice';
import { resetQuizState } from '@slices/admin-slices/quiz-attempts.slice';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const QuizAttempts = () => {
  const dispatch = useDispatch();
  const [selectedCourseId, setSelectedCourseId] = useState();
  const [selectedChapterId, setSelectedChapterId] = useState();
  const [selectedLessonId, setSelectedLessonId] = useState();
  const [quizId, setQuizId] = useState(null);

  const courses = useFetchCourses();
  const chapters = useSelector(selectAllChapters);
  const lessons = useSelector(selectAllLessons);

  const handleChapterCourse = (id) => {
    dispatch(fetchChapters({ currentPage: 1, pageSize: 10, courseId: id }));
    setSelectedCourseId(id);
    setSelectedChapterId(null);
    setSelectedLessonId(null);
    dispatch(resetQuizState());
    setQuizId(null);
  };

  const handleLessonChapter = (id) => {
    dispatch(fetchLessons({ currentPage: 1, pageSize: 10, chapterId: id }));
    setSelectedChapterId(id);
    setSelectedLessonId(null);
    dispatch(resetQuizState());
    setQuizId(null);
  };

  const handleSelectedLesson = async (id) => {
    dispatch(resetQuizState());
    setSelectedLessonId(id);
    const quizResponse = await dispatch(getQuizIdByLessonId(id)).unwrap();
    setQuizId(quizResponse.data);
  };

  return (
    <div>
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

      {selectedCourseId && selectedChapterId && selectedLessonId && !quizId && (
        <div className="flex items-center gap-4">
          <p className="text-center">This Lesson doesn`t have any Quiz attempts </p>
        </div>
      )}

      {selectedCourseId && selectedChapterId && selectedLessonId && !!quizId && (
        <div>
          <span className="text-gray-300">Attempts:</span>
          <QuizAttemptsList quizId={quizId} />
        </div>
      )}
    </div>
  );
};

export default QuizAttempts;
