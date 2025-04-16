import coverImage from '@assets/images/user-cover.png';
import { useIsStudent } from '@hooks';
import alertService from '@services/alert/alert.service';
import { fetchCourseById } from '@services/client-services/course-profile.service';
import {
  chaptersThunks,
  fetchCourseChapters,
  fetchCourseStudents,
  lessonsThunks,
  quizzesThunks
} from '@services/client-services/instructor-course-profile.service';
import { Modal, SidebarPanel } from '@shared/components';
import { selectCourseProfile } from '@slices/client-slices/course-profile.slice';
import { selectAllChapters } from '@slices/client-slices/instructor-chapters.slice';
import { getImageFullPath } from '@utils/image-path';
import { Chip } from 'primereact/chip';
import { useEffect, useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  CourseContent,
  InstructorChapterEntry,
  InstructorLessonEntry,
  InstructorQuizEntry
} from '@(client)/features/instructor-course-profile';
import './course-profile.css';

const InstructorCourseProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isStudent = useIsStudent();

  const courseData = useSelector(selectCourseProfile);
  const courseChapters = useSelector(selectAllChapters);

  const [state, dispatchReducer] = useReducer(reducer, initialState);

  useEffect(() => {
    if (id && !isStudent) {
      if (!courseData?.id) {
        dispatch(fetchCourseById(id));
      }
      dispatch(fetchCourseChapters(id));
    }
  }, [id, dispatch, isStudent, courseData?.id]);

  useEffect(() => {
    if (courseData?.editAble && !isStudent) {
      dispatch(fetchCourseStudents({ courseId: courseData.id, pageNumber: 1, pageSize: 10 }));
    } else {
      navigate(`/course/${id}`);
    }
  }, [courseData, dispatch, isStudent, navigate, id]);

  const resetForm = async () => {
    dispatchReducer({ type: 'RESET' });
  };

  const handleQuizFormClose = () => {
    dispatch(fetchCourseChapters(id));
    dispatchReducer({ type: 'RESET' });
  };

  const handleDeleteChapter = (chapterId) => {
    alertService.showConfirmation({
      title: 'Confirm Delete',
      body: 'Are you sure you want delete this chapter',
      callback: () => dispatch(chaptersThunks.delete(chapterId))
    });
  };

  const handleDeleteLesson = ({ lessonId }) => {
    alertService.showConfirmation({
      title: 'Confirm Delete',
      body: 'Are you sure you want delete this lesson',
      callback: () => dispatch(lessonsThunks.delete(lessonId))
    });
  };

  const handleDeleteQuiz = (quizId) => {
    alertService.showConfirmation({
      title: 'Confirm Delete',
      body: 'Are you sure you want delete this quiz',
      callback: () => {
        dispatch(quizzesThunks.delete(quizId))
          .unwrap()
          .then(() => {
            handleQuizFormClose();
          });
      }
    });
  };

  return (
    <div className="relative">
      <div className="relative">
        <img
          src={getImageFullPath(courseData?.imageOverView, coverImage)}
          alt="courseCover"
          className="w-full h-[478px] brightness-50"
        />
        <div className="absolute top-0 text-3xl font-semibold w-full justify-center flex-col flex items-center h-full text-shadow-50 text-white text-center gap-1">
          <p>{courseData?.name}</p>
          <span className="flex gap-2 flex-wrap">
            {courseData?.categories?.map((category) => (
              <Chip
                key={category}
                className="bg-slate-400 rounded-md bg-opacity-20 px-2 text-slate-300"
                label={category}
              />
            ))}
          </span>
        </div>
      </div>
      <div className="flex w-full justify-center mb-10">
        <CourseContent
          courseChapters={courseChapters}
          courseData={courseData}
          onAddChapter={() => dispatchReducer({ type: 'SET_CHAPTER' })}
          onEditChapter={(chapterObject) => dispatchReducer({ type: 'SET_CHAPTER', payload: chapterObject })}
          onEditLesson={(lessonObject) => dispatchReducer({ type: 'SET_LESSON', payload: lessonObject })}
          onAddLesson={(chapterId) => dispatchReducer({ type: 'SET_LESSON', payload: { chapterId } })}
          handleDeleteChapter={handleDeleteChapter}
          handleDeleteLesson={handleDeleteLesson}
          onAddQuiz={(lessonId) => dispatchReducer({ type: 'SET_QUIZ', payload: { lessonId } })}
          onEditQuiz={(quizObject) => dispatchReducer({ type: 'SET_QUIZ', payload: quizObject })}
          onDeleteQuiz={handleDeleteQuiz}
        />
      </div>

      <Modal isOpen={state.isModalOpen} onClose={resetForm}>
        <InstructorChapterEntry onSubmitted={resetForm} courseId={courseData.id} chapter={state.chapterObject} />
      </Modal>

      <SidebarPanel
        isVisible={state.isLessonModalOpen}
        position={'right'}
        onHide={resetForm}
        isDismissible
        className="course-profile"
        title={`${state.lessonObject?.id ? 'Update' : 'Add'} Lesson`}
      >
        <InstructorLessonEntry onSubmitted={resetForm} lesson={state.lessonObject} />
      </SidebarPanel>

      <SidebarPanel
        isVisible={state.isQuizModalOpen}
        position={'top'}
        isFullScreen
        onHide={handleQuizFormClose}
        isDismissible
        className="course-profile quiz-entry"
        title="Quiz Form"
      >
        <InstructorQuizEntry lessonId={state.quizObject?.lessonId} quiz={state.quizObject} />
      </SidebarPanel>
    </div>
  );
};

export default InstructorCourseProfile;

const initialState = {
  isModalOpen: false,
  isLessonModalOpen: false,
  isQuizModalOpen: false,
  chapterObject: null,
  lessonObject: null,
  quizObject: null
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_CHAPTER':
      return { ...state, chapterObject: action.payload, isModalOpen: true };
    case 'SET_LESSON':
      return { ...state, lessonObject: action.payload, isLessonModalOpen: true };
    case 'SET_QUIZ':
      return { ...state, quizObject: action.payload, isQuizModalOpen: true };
    case 'RESET':
      return { ...initialState };
    default:
      throw new Error('Unhandled action type: ' + action.type);
  }
}
