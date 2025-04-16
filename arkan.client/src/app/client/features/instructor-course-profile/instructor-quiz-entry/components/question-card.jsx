import { useDispatch } from 'react-redux';
import { questionsThunks } from '@services/client-services/instructor-course-profile.service';
import { PlusIcon, EditIcon, TrashIcon } from '@shared/components';
import { Button } from 'primereact/button';
import { AnswersCard } from './answers-card';
import alertService from '@services/alert/alert.service';
import { useState } from 'react';
export const QuestionCard = ({ question, index, handleEditQuestion, handleAddAnswer, handleEditAnswer }) => {
  const dispatch = useDispatch();
  const [showAnswers, setShowAnswers] = useState(false);

  const handleDelete = (questionId) => {
    alertService.showConfirmation({
      title: 'Confirm Delete',
      body: 'Are you sure you want delete this question',
      callback: () => dispatch(questionsThunks.delete(questionId))
    });
  };

  const toggleAnswers = () => {
    setShowAnswers(!showAnswers);
  };

  return (
    <div className="bg-white rounded-lg p-10 flex flex-col gap-2">
      <div className="flex justify-between">
        <div className="">
          <h3 className="text-lg text-gray-600 font-semibold">Question {index + 1}</h3>
          <p>{question.title}</p>
          <button className="text-primary text-sm cursor-pointer hover:font-semibold" onClick={toggleAnswers}>
            {showAnswers ? 'Hide' : 'Show'} Answers
          </button>
        </div>

        <div className="flex gap-4 flex-col justify-center">
          <Button tooltip="Edit" onClick={() => handleEditQuestion(question)}>
            <EditIcon />
          </Button>
          <Button tooltip="Delete" onClick={() => handleDelete(question.id)}>
            <TrashIcon />
          </Button>
        </div>
      </div>

      {showAnswers && (
        <div className="p-3 border-t border-blue-grey-600">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-800">Answers:</span>
            <Button className="text-primary" tooltip="Add Answer" onClick={() => handleAddAnswer(question)}>
              <PlusIcon />
            </Button>
          </div>
          {!question.answers?.length && <span>Click on Plus to add Answers</span>}
          {!!question.answers?.length && showAnswers && (
            <div className="flex flex-wrap flex-col gap-2">
              {[...question.answers]
                ?.sort((a, b) => a?.order - b?.order)
                ?.map((answer) => (
                  <AnswersCard
                    key={answer.id}
                    answer={answer}
                    editAnswer={(answer) => handleEditAnswer(answer, question)}
                  />
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
