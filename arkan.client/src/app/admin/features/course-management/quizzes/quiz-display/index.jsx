import { usePermissionCheck } from '@hooks';
import { Button } from 'primereact/button';
import { EditIcon, TrashIcon, PlusIcon, SidebarPanel } from '@shared/components';
import { useState } from 'react';
import alertService from '@services/alert/alert.service';
import { deleteQuiz } from '@/services/admin-services/course-management-services/quizzes.service';
import { useDispatch } from 'react-redux';
import { QuizQuestion } from '../quiz-question';
import { QuestionEntry } from '../question-entry';

export const QuizDisplay = ({ quiz, editQuiz }) => {
  const { create, edit, delete: canDelete } = usePermissionCheck('quizzes');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const dispatch = useDispatch();

  const handleEditQuestion = (question) => {
    setSelectedQuestion(question);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setSelectedQuestion(null);
  };

  const handleDelete = (quiz) => {
    alertService.showConfirmation({
      title: 'Confirm Delete',
      body: 'Are you sure you want delete this quiz',
      callback: () => dispatch(deleteQuiz(quiz))
    });
  };

  return (
    <div className="mx-auto p-4">
      <div className="mb-8">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold text-gray-200">Title: {quiz.title}</h2>
          <div className="flex gap-4">
            {edit && (
              <Button tooltip="Edit" onClick={() => editQuiz(quiz)}>
                <EditIcon />
              </Button>
            )}
            {canDelete && (
              <Button tooltip="Delete" onClick={() => handleDelete(quiz)}>
                <TrashIcon />
              </Button>
            )}
          </div>
        </div>
        <p className="text-gray-300">Description: {quiz.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-md text-gray-400">Time Limit: {quiz.timeLimit} min</span>
          <span className="text-md text-gray-400">Total Marks: {quiz.totalMarks}</span>
        </div>
      </div>

      <div className="p-3 border-t border-blue-grey-600">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-300">Questions:</span>
          {create && (
            <Button className="text-primary" tooltip="Add Question" onClick={() => setIsModalOpen(true)}>
              <PlusIcon />
            </Button>
          )}
        </div>
        {!quiz.questions?.length && <span> No questions were provided</span>}
        {!!quiz.questions?.length && (
          <div className="flex flex-wrap">
            {[...quiz.questions]
              ?.sort((a, b) => a?.order - b?.order)
              ?.map((question) => (
                <QuizQuestion key={question.id} question={question} editQuestion={handleEditQuestion} />
              ))}
          </div>
        )}
      </div>

      <SidebarPanel
        isVisible={isModalOpen}
        position={'right'}
        onHide={resetForm}
        isDismissible
        title={`${selectedQuestion ? 'Update' : 'Add'} Question`}
      >
        <QuestionEntry question={selectedQuestion} onSubmitted={resetForm} quizId={quiz.id} />
      </SidebarPanel>
    </div>
  );
};
