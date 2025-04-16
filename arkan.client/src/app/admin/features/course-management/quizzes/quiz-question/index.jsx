import { EditIcon, TrashIcon, ImagePreview, PlusIcon, SidebarPanel } from '@shared/components';
import { Button } from 'primereact/button';
import { usePermissionCheck } from '@hooks';
import { useState } from 'react';
import { AnswersCard } from '../answers-card';
import alertService from '@services/alert/alert.service';
import { deleteQuestion } from '@/services/admin-services/course-management-services/questions.service';
import { useDispatch } from 'react-redux';
import { AnswerEntry } from '../answer-entry';

export const QuizQuestion = ({ question, editQuestion }) => {
  const { edit, delete: canDelete, create } = usePermissionCheck('quizzes');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const dispatch = useDispatch();

  const handleEditAnswer = (answer) => {
    setSelectedAnswer(answer);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setSelectedAnswer(null);
  };

  const handleDelete = (question) => {
    alertService.showConfirmation({
      title: 'Confirm Delete',
      body: 'Are you sure you want delete this question',
      callback: () => dispatch(deleteQuestion(question))
    });
  };

  return (
    <div className="rounded-lg p-4 mb-4 bg-slate-900 mr-2 items-center w-96">
      <div className="mb-4 flex gap-4 justify-between">
        <div className="rounded-lg p-2 flex items-center gap-2 justify-evenly">
          {question.image && (
            <div className="min-w-[5rem]">
              <ImagePreview
                src={question.image}
                alt={question.title}
                className="w-20 h-20 object-scale-down rounded-3xl bg-white"
              />
            </div>
          )}

          <div className="text-gray-300">
            <h2 className="text-lg font-semibold line-clamp-2">Title: {question.title}</h2>
            <p className="mb-2 text-gray-400 text-md line-clamp-1">Description: {question.description}</p>
          </div>
        </div>

        <div className="flex gap-4 flex-col justify-center">
          {edit && (
            <Button tooltip="Edit" onClick={() => editQuestion(question)}>
              <EditIcon />
            </Button>
          )}
          {canDelete && (
            <Button tooltip="Delete" onClick={() => handleDelete(question)}>
              <TrashIcon />
            </Button>
          )}
        </div>
      </div>

      <div className="p-3 border-t border-blue-grey-600">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-300">Answers:</span>
          {create && (
            <Button className="text-primary" tooltip="Add Answer" onClick={() => setIsModalOpen(true)}>
              <PlusIcon />
            </Button>
          )}
        </div>
        {!question.answers?.length && <span> No answers were provided</span>}
        {!!question.answers?.length && (
          <div className="flex flex-wrap flex-col gap-2">
            {[...question.answers]
              ?.sort((a, b) => a?.order - b?.order)
              ?.map((answer) => (
                <AnswersCard key={answer.id} answer={answer} question={question} editAnswer={handleEditAnswer} />
              ))}
          </div>
        )}
      </div>

      <SidebarPanel
        isVisible={isModalOpen}
        position={'right'}
        onHide={resetForm}
        isDismissible
        title={`${selectedAnswer ? 'Update' : 'Add'} Answer`}
      >
        <AnswerEntry answer={selectedAnswer} onSubmitted={resetForm} questionId={question.id} />
      </SidebarPanel>
    </div>
  );
};
