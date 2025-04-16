import { useState } from 'react';
import { ImagePreview, FeatherIcon } from '@shared/components';
import { convertToFullTime } from '@utils/date-format';
import Lottie from 'lottie-react';
import animateSuccess from '@assets/lottie/animate-success';
import animateFailure from '@assets/lottie/animate-failure';
import classNames from 'classnames';

export const QuizReview = ({ quizReview, timeLimit, quizTotalTime, cancelQuiz }) => {
  const [showAnswers, setShowAnswers] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { questions, studentMark, quizTotalPoints } = quizReview;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const time = quizTotalTime - timeLimit / 60;

  const toggleAnswers = () => setShowAnswers(!showAnswers);
  const handleNext = () => (isLastQuestion ? cancelQuiz() : setCurrentQuestionIndex(currentQuestionIndex + 1));

  const renderQuestion = () => {
    const { title, points, image, answers } = questions[currentQuestionIndex];

    return (
      <div className="animate-fade-up quiz-review-question py-2 px-6">
        <div className="flex w-full justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-700 my-4">{title}</h3>
          <span className="font-semibold text-blue-400">({points} Points)</span>
        </div>

        {image && (
          <ImagePreview src={image} className="max-h-[200px] w-full" containerClassName="w-full" alt="question image" />
        )}

        <div className="space-y-4 flex flex-col">
          {answers.map((answer) => (
            <Answer key={answer.id} answer={answer} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      {questions.length > 0 && (
        <div className="px-6">
          <div className="font-bold text-center mt-8">
            <Lottie
              className="h-28"
              loop={false}
              animationData={studentMark === quizTotalPoints ? animateSuccess : animateFailure}
            />
            <p>
              You score {studentMark} / {quizTotalPoints}
            </p>
            <p>Time taken {convertToFullTime(time)}</p>
          </div>
          <div className="pt-2 text-center font-normal text-base">
            <button
              onClick={toggleAnswers}
              className={classNames('px-4 py-3 rounded-md hover:underline font-semibold transition-all mt-4', {
                'text-blue-400 hover:text-blue-500': !showAnswers,
                'text-red-400 hover:text-red-500': showAnswers
              })}
            >
              {showAnswers ? 'Hide Answers' : 'Show Answers'}
            </button>
            <button
              className="bg-arkan shadow-md px-4 py-2 rounded-md text-white hover:bg-arkan-dark transition-all mt-4"
              onClick={cancelQuiz}
            >
              Exit Quiz
            </button>
          </div>
          {showAnswers && renderQuestion()}
          {showAnswers && (
            <div className="text-end">
              <button
                type="button"
                onClick={handleNext}
                className="bg-arkan shadow-md px-4 py-3 rounded-md text-white hover:bg-arkan-dark transition-all mt-4"
              >
                {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Answer = ({ answer }) => (
  <div className="flex items-center justify-between group">
    <div
      className={classNames(
        'flex items-center group-hover:bg-slate-300 rounded-md shadow-md py-4 px-2 flex-1 gap-4 justify-between',
        {
          'bg-gray-200 border-green-500 border-e-8': answer.isCorrect,
          'bg-gray-300 border-red-500 border-e-8': answer.isSelected && !answer.isCorrect,
          'bg-slate-100': !answer.isSelected
        }
      )}
    >
      <div className="ml-2 text-black font-semibold">{answer.title}</div>
      <div className="flex">
        {answer.isCorrect && !answer.isSelected && (
          <div className="m-3 bg-green-500 animate-wiggle-more rounded-full p-2 flex text-white px-4 gap-4 items-center">
            Correct Answer
            <FeatherIcon name="Check" color="white" size={18} />
          </div>
        )}
        {answer.isSelected && (
          <div
            className={classNames('m-3 rounded-full animate-wiggle-more p-2 flex text-white px-4 gap-4 items-center', {
              'bg-green-500': answer.isCorrect,
              'bg-red-500': !answer.isCorrect
            })}
          >
            Selected Answer
            {answer.isCorrect ? (
              <FeatherIcon name="Check" color="white" size={18} />
            ) : (
              <FeatherIcon name="X" color="white" size={18} />
            )}
          </div>
        )}
      </div>
    </div>
  </div>
);
