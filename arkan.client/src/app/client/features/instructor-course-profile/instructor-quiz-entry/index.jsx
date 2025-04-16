import { quizzesThunks } from '@services/client-services/instructor-course-profile.service';
import { PlusIcon } from '@shared/components/icons/plus-icon';
import { resetQuiz, selectInstructorQuiz } from '@slices/client-slices/instructor-quiz.slice';
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnswerForm } from './components/answer-form';
import { QuestionCard } from './components/question-card';
import { QuestionForm } from './components/question-form';
import { QuizForm } from './components/quiz-form';
import './instructor-quiz-entry.css';

export const InstructorQuizEntry = ({ lessonId, quiz }) => {
  const [addQuestion, setAddQuestion] = useState(false);
  const [addAnswer, setAddAnswer] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const dispatch = useDispatch();

  let quizObject = useSelector(selectInstructorQuiz);

  useEffect(() => {
    if (lessonId && quiz?.id) {
      dispatch(quizzesThunks.get(lessonId));
    } else {
      dispatch(resetQuiz());
    }
  }, [lessonId, quiz]);

  const handleQuestionSubmitted = () => {
    setAddQuestion(false);
  };

  const handleEditQuestion = (question) => {
    setSelectedQuestion(question);
    setAddQuestion(true);
    setAddAnswer(false);
  };

  const handleAnswerSubmitted = () => {
    setAddAnswer(false);
  };

  const handleAddAnswer = (question) => {
    setSelectedQuestion(question);
    setSelectedAnswer(null);
    setAddQuestion(false);
    setAddAnswer(true);
  };

  const handleAddQuestion = () => {
    setSelectedQuestion(null);
    setSelectedAnswer(null);
    setAddQuestion(true);
    setAddAnswer(false);
  };

  const handleEditAnswer = (answer, question) => {
    setSelectedQuestion(question);
    setSelectedAnswer(answer);
    setAddAnswer(true);
    setAddQuestion(false);
  };

  const resetForm = () => {
    quizObject = null;
    dispatch(quizzesThunks.get(lessonId));
  };

  return (
    <div className="p-0 lg:p-10 flex gap-10 flex-col">
      <div className="">
        <QuizForm lessonId={lessonId} onSubmitted={resetForm} quiz={quizObject} key={quizObject?.id} />
      </div>
      {quizObject?.id && (
        <div className="flex flex-row-reverse gap-10 border rounded-lg shadow-md p-10 flex-wrap lg:flex-nowrap">
          <div className="flex flex-col gap-4 w-full lg:w-2/6">
            <div className="flex justify-between items-center">
              <span className="text-gray-200">Questions:</span>
              <Button className="text-primary" tooltip="Add Question" onClick={handleAddQuestion}>
                <PlusIcon />
              </Button>
            </div>
            {!quizObject.questions?.length && <span> Click on the Plus to add a question</span>}

            {quizObject?.questions?.map((question, index) => (
              <QuestionCard
                question={question}
                key={question.id}
                index={index}
                handleEditQuestion={handleEditQuestion}
                handleEditAnswer={handleEditAnswer}
                handleAddAnswer={handleAddAnswer}
              />
            ))}
          </div>
          <div className="flex flex-col gap-4 w-full lg:w-4/6">
            {!addQuestion && !addAnswer && (
              <div className="h-[350px] flex mt-14 border-blue-grey-400 hover:border-white border-2 rounded-md justify-center items-center text-white border-dashed text-lg">
                <p>Select a question or add a new one</p>
              </div>
            )}
            {addQuestion && (
              <QuestionForm
                quizId={quizObject?.id}
                question={selectedQuestion}
                onSubmitted={handleQuestionSubmitted}
                onCancel={() => {
                  setAddQuestion(false);
                }}
              />
            )}
            {addAnswer && (
              <AnswerForm
                questionId={selectedQuestion?.id}
                onSubmitted={handleAnswerSubmitted}
                answer={selectedAnswer}
                onCancel={() => {
                  setAddAnswer(false);
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
