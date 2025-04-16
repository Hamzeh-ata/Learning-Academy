import { convertToFullTime } from '@utils/date-format';
import { FeatherIcon } from '@shared/components';

export const QuizInfo = ({ quizInfo, startQuiz, cancelQuiz }) => (
  <div className="flex flex-col gap-6 pt-20 px-15">
    <h2 className="text-2xl font-semibold mb-2 text-black">
      {quizInfo.isRequierd ? 'Required Quiz' : 'Optional Quiz'} for {quizInfo.lessonName}
    </h2>
    <p className="text-gray-800 text-lg mb-2">Description: {quizInfo.description}</p>
    <div className="bg-slate-100 p-6 rounded-lg text-black">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <FeatherIcon name="Clock" />
        General Info:
      </h3>
      <ul className="list-disc list-inside space-y-2 mt-2">
        <li>Starting this quiz will register an attempt.</li>
        <li>Closing or ending the quiz prevents further attempts.</li>
        <li>Submitting an answer finalizes it without resubmission options.</li>
      </ul>
      <p className="flex items-center mt-2 gap-2">Time Limit: {convertToFullTime(quizInfo?.timeLimit)}</p>
    </div>
    <div className="mt-4 flex justify-end space-x-2">
      <button
        className="flex gap-2 items-center text-gray-500 px-4 py-2 rounded-md hover:text-red-600 transition-all"
        onClick={() => {
          cancelQuiz && cancelQuiz(quizInfo.id);
        }}
      >
        Cancel
      </button>
      <button
        className="flex items-center gap-2 bg-arkan px-4 py-2 rounded-md text-white hover:bg-arkan-dark transition-all"
        onClick={() => {
          startQuiz && startQuiz(quizInfo.id);
        }}
      >
        <FeatherIcon name="Play" />
        Start Quiz
      </button>
    </div>
  </div>
);
