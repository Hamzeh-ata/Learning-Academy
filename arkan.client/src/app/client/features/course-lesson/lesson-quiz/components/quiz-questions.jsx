import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePreventWindowClose, useNavigationBlock } from '@hooks';
import { selectQuizAttempt } from '@slices/client-slices/lesson-quiz.slice';
import { finishQuiz, reviewQuiz, submitAnswer } from '@services/client-services/student-quiz.service';
import { FeatherIcon, ImagePreview, CourseLoader } from '@shared/components';
import classNames from 'classnames';

const NAVIGATION_BLOCK_MESSAGE = 'Leaving this page will end your quiz session. Are you sure?';

export const QuizQuestions = ({ quizInfo, isTimeout }) => {
  const dispatch = useDispatch();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { questions, loading } = useSelector(selectQuizAttempt);

  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const submitQuiz = async () => {
    setIsLoading(true);
    try {
      await dispatch(finishQuiz(quizInfo.id)).unwrap();
      dispatch(reviewQuiz(quizInfo.id));
    } catch (error) {
      console.error('Failed to submit or review quiz:', error);
    }
    setIsLoading(false);
  };

  usePreventWindowClose(NAVIGATION_BLOCK_MESSAGE, submitQuiz);
  useNavigationBlock(NAVIGATION_BLOCK_MESSAGE, true, submitQuiz);

  useEffect(() => {
    if (isTimeout) {
      submitQuiz();
    }
  }, [isTimeout]);

  const handleAnswerSelection = (answerId) => {
    setSelectedAnswer(answerId);
  };

  const handleNext = async () => {
    if (selectedAnswer === null) {
      return;
    }
    const answerObject = {
      answerId: selectedAnswer,
      quizId: quizInfo.id,
      questionId: questions[currentQuestionIndex]?.id
    };
    setIsLoading(true);
    try {
      await dispatch(submitAnswer(answerObject)).unwrap();
      if (!isLastQuestion) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
      } else {
        submitQuiz();
      }
    } catch (error) {
      console.error('Failed to handle next question:', error);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <div className={classNames('px-6 relative', { 'blur-md': isLoading })}>
        {questions.length > 0 && (
          <div className="quiz-info px-6">
            <p className="bg-[#3ba7c5] max-w-[150px] px-4 py-2 rounded-lg shadow-md text-white">
              Question {currentQuestionIndex + 1}/{questions.length}
            </p>
            <h3 className="text-lg font-semibold text-gray-700 my-4">{questions[currentQuestionIndex]?.title}</h3>

            {questions[currentQuestionIndex]?.description && (
              <p className="text-l font-semibold text-gray-600 my-4 p-4 bg-gray-100 rounded-md whitespace-pre-wrap break-words">
                {questions[currentQuestionIndex]?.description}
              </p>
            )}
            {questions[currentQuestionIndex]?.image && (
              <ImagePreview
                src={questions[currentQuestionIndex]?.image}
                className="max-h-[200px] w-full"
                containerClassName="w-full"
                alt="question image"
              />
            )}
            <p className="mt-2 border-t py-4">Choose answer</p>
            <div className="space-y-4 flex flex-col">
              {questions[currentQuestionIndex].answers.map((answer) => (
                <AnswerOption
                  key={answer.id}
                  answer={answer}
                  isSelected={selectedAnswer === answer.id}
                  onSelect={handleAnswerSelection}
                />
              ))}
            </div>
          </div>
        )}
        <div className="text-end">
          <button
            type="button"
            disabled={!selectedAnswer}
            onClick={handleNext}
            className="bg-arkan shadow-md px-4 py-3 rounded-md text-white hover:bg-arkan-dark transition-all mt-4"
          >
            {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      </div>

      {(isLoading || loading) && (
        <div className=" quiz-loader flex justify-center h-full mb-2 absolute top-1/2 left-1/2">
          <CourseLoader />
        </div>
      )}
    </div>
  );
};

const AnswerOption = ({ answer, isSelected, onSelect }) => (
  <div onClick={() => onSelect(answer.id)} className="flex flex-col cursor-pointer group">
    <div className="flex items-center justify-start">
      <div
        className={isSelected ? 'm-3 bg-green-500 rounded-full p-2' : 'm-3 border-2 border-gray-600 rounded-full p-2'}
      >
        <FeatherIcon name={isSelected ? 'Check' : 'Plus'} color={isSelected ? 'white' : 'transparent'} size={15} />
      </div>

      <div className="flex flex-1 flex-col">
        <div
          className={classNames(
            'flex items-center group-hover:bg-slate-300 rounded-md shadow-md py-4 px-2 flex-1 gap-4',
            {
              'bg-gray-300 border-arkan border-e-8': isSelected,
              'bg-slate-100': !isSelected
            }
          )}
        >
          <div className="ml-2 text-black font-semibold">{answer.title}</div>

          {answer.image && (
            <ImagePreview
              src={answer.image}
              className="h-[60px] bg-gray-700 p-2 rounded-lg w-[60px]"
              alt="answer image"
            />
          )}
        </div>

        {answer?.description && (
          <div className="mt-2 p-4 bg-gray-100">
            <p className="text-sm font-semibold text-gray-700 whitespace-pre-wrap break-words">{answer.description}</p>
          </div>
        )}
      </div>
    </div>
  </div>
);
