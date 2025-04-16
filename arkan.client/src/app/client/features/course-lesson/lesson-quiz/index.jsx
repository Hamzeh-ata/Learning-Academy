import { FeatherIcon } from '@shared/components';
import { QuizInfo } from './components/quiz-info';
import { QuizQuestions } from './components/quiz-questions';
import classNames from 'classnames';
import { convertToFullTime } from '@utils/date-format';
import { useQuizTimer } from './hooks/useQuizTimer';
import { useDispatch, useSelector } from 'react-redux';
import { resetAttempt, resetReview, selectQuizReview } from '@slices/client-slices/lesson-quiz.slice';
import { QuizReview } from './components/quiz-review';

export const LessonQuiz = ({ quizInfo, cancelQuiz, setQuizStarted, quizStarted }) => {
  const quizReview = useSelector(selectQuizReview);
  const dispatch = useDispatch();
  const { timeLimit, handleStartQuiz, handleCancelQuiz } = useQuizTimer(
    quizStarted,
    quizInfo?.timeLimit * 60,
    quizInfo?.lessonId,
    setQuizStarted,
    () => {
      cancelQuiz(quizInfo?.id);
      dispatch(resetReview());
      dispatch(resetAttempt());
    }
  );

  if (!quizInfo?.id) {
    return;
  }

  const timeClass = classNames({
    'text-red-500 animate-pulse': timeLimit < 10,
    'text-black': timeLimit >= 10
  });

  if (quizReview?.id) {
    setQuizStarted(false);
  }

  return (
    <div className="flex h-screen flex-col lg:flex-row">
      <div className="quiz-image w-full lg:w-[35%] bg-cover bg-no-repeat h-48 lg:h-auto"></div>
      <div className="flex w-full flex-col">
        <div className="flex w-full justify-between font-bold py-6 px-4 text-black border-b">
          <div>Quiz {quizInfo?.name}</div>
          <div className={classNames('flex items-center gap-2', timeClass)}>
            <FeatherIcon name="Clock" />
            {convertToFullTime(timeLimit / 60)}
          </div>
        </div>
        <div className="px-4 lg:px-6 flex flex-col gap-4 overflow-hidden w-full h-full py-3">
          {!quizStarted && !quizReview.id && (
            <QuizInfo quizInfo={quizInfo} startQuiz={handleStartQuiz} cancelQuiz={handleCancelQuiz} />
          )}
          {quizStarted && !quizReview.id && <QuizQuestions quizInfo={quizInfo} isTimeout={timeLimit === 0} />}
          {quizReview.id && (
            <QuizReview
              quizReview={quizReview}
              timeLimit={timeLimit}
              quizTotalTime={quizInfo.timeLimit}
              cancelQuiz={handleCancelQuiz}
            />
          )}
        </div>
      </div>
    </div>
  );
};
