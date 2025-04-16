import { CourseBanner, CourseLessonsList, LessonQuiz } from '@(client)/features/course-lesson';
import { completeLesson, fetchCourseById, fetchCourseChapters } from '@services/client-services/course-profile.service';
import { FeatherIcon, SidebarPanel } from '@shared/components';
import { selectCourseProfile, selectCourseProfileChapters } from '@slices/client-slices/course-profile.slice';
import Vimeo from '@u-wave/react-vimeo';
import { getImageFullPath } from '@utils/image-path';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import './course-lesson.css';

const CourseLesson = () => {
  const { courseId, lessonId } = useParams();
  const dispatch = useDispatch();
  const courseData = useSelector(selectCourseProfile);
  const courseChapters = useSelector(selectCourseProfileChapters);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);

  let completedLessons = 0;

  if (courseData.lessonsCount) {
    if (courseChapters?.chapters?.length) {
      const lessons = courseChapters?.chapters.flatMap((e) => e.lessons);
      completedLessons = lessons?.filter((e) => e.isCompleted)?.length;
    }
  }

  useEffect(() => {
    getPageData();
  }, [courseChapters.chapters?.length, courseData.id, courseId, dispatch]);

  function getPageData() {
    if (courseId) {
      if (!courseData.id) {
        dispatch(fetchCourseById(courseId));
      }
      dispatch(fetchCourseChapters(courseId));
    }
  }

  useEffect(() => {
    if (lessonId) {
      setSelectedLesson(courseChapters.chapters?.flatMap((e) => e.lessons).find((e) => e.id?.toString() == lessonId));
    } else {
      const allLessons = courseChapters.chapters?.flatMap((e) => e.lessons);
      const firstIncompleteLesson = allLessons?.find((lesson) => !lesson.isCompleted);
      setSelectedLesson(firstIncompleteLesson || allLessons?.[allLessons.length - 1]);
    }
  }, [courseChapters.chapters, lessonId]);

  function handleCompleteLesson() {
    dispatch(completeLesson(selectedLesson.id));
  }

  return (
    <div className="relative bg-slate-900 lg:pt-2">
      <CourseBanner courseData={courseData} />
      <div className="flex justify-center py-4 flex-col items-center bg-[#eee]">
        <div className="flex bg-white p-8 w-full lg:w-[95%] rounded-lg relative lg:-top-24 shadow-lg gap-8 flex-wrap-reverse">
          <div className="w-full lg:w-[30%] flex flex-col gap-4">
            <div className="flex gap-4">
              <img
                className="rounded-md bg-white shadow-md p-0.5 w-12 h-12"
                src={getImageFullPath(courseData.image)}
                alt="default video"
              />
              <div>
                <p className="font-semibold text-base">{courseData.name}</p>
                <p className="text-gray-400 inline-flex items-center gap-2 text-md">
                  <FeatherIcon name="Loader" size={18} className="text-arkan" />
                  {completedLessons}/{courseData.lessonsCount} completed
                </p>
              </div>
            </div>
            <div>
              <CourseLessonsList
                courseData={courseData}
                chapters={courseChapters.chapters}
                selectedLesson={selectedLesson}
                setSelectedLesson={setSelectedLesson}
                setSelectedQuiz={setSelectedQuiz}
              />
            </div>
          </div>
          <div className="flex w-full lg:w-[66%] justify-center gap-3 relative flex-col">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-600">{selectedLesson?.name}</h3>
              {!selectedLesson?.isCompleted && (
                <button
                  className="bg-arkan hover:bg-arkan-dark text-white px-4 rounded-md py-2"
                  onClick={handleCompleteLesson}
                >
                  Mark as completed
                </button>
              )}
            </div>
            <div className="relative pt-[56.25%] overflow-hidden justify-center flex w-full px-8 rounded-2xl shadow-lg">
              {selectedLesson?.videoUrl && (
                <Vimeo
                  key={selectedLesson.videoUrl}
                  video={selectedLesson.videoUrl}
                  showTitle={false}
                  height={'100%'}
                  className="inset-0 absolute w-full h-full cursor-pointer bg-slate-900"
                />
              )}
              {!selectedLesson?.videoUrl && (
                <img
                  className="w-full h-full absolute inset-0"
                  src={getImageFullPath(courseData.image)}
                  alt="default video"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <SidebarPanel
        isVisible={!!selectedQuiz?.id}
        position={'top'}
        isFullScreen
        onHide={() => {
          setSelectedQuiz(null);
          getPageData();
        }}
        className="course-lesson-sidebar"
      >
        {!!selectedQuiz?.id && (
          <LessonQuiz
            quizInfo={selectedQuiz}
            quizStarted={quizStarted}
            setQuizStarted={setQuizStarted}
            cancelQuiz={() => {
              setSelectedQuiz(null);
              location.reload();
            }}
          />
        )}
      </SidebarPanel>
    </div>
  );
};

export default CourseLesson;
