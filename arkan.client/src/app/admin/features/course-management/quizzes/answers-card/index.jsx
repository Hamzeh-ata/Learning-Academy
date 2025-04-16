import { usePermissionCheck } from '@hooks';
import { EditIcon, TrashIcon, ImagePreview } from '@shared/components';
import { Button } from 'primereact/button';
import { useDispatch } from 'react-redux';
import { deleteAnswer } from '@/services/admin-services/course-management-services/answers.service';
import alertService from '@services/alert/alert.service';

export const AnswersCard = ({ answer, editAnswer, question }) => {
  const { edit, delete: canDelete } = usePermissionCheck('quizzes');
  const dispatch = useDispatch();

  const handleDeleteAnswer = (answer) => {
    alertService.showConfirmation({
      title: 'Confirm Delete',
      body: 'Are you sure you want delete this answer',
      callback: () => dispatch(deleteAnswer({ answer, questionId: question.id }))
    });
  };

  return (
    <div
      key={answer.id}
      className={`text-left flex gap-2 p-2 rounded-lg justify-between shadow-2xl border ${answer.isCorrect ? 'border-teal-800' : 'border-red-800'} `}
    >
      <div className={`rounded-lg p-2 flex items-center gap-2`}>
        {answer.image && (
          <ImagePreview src={answer.image} alt={answer.title} className="w-16 h-16 object-cover rounded-3xl bg-white" />
        )}
        <div>
          <p className="font-semibold text-gray-400 line-clamp-2">Title: {answer.title}</p>
          <p className="text-md text-gray-500 line-clamp-1">Description: {answer.description}</p>
        </div>
      </div>
      <div className="flex gap-4 flex-col justify-center">
        {edit && (
          <Button tooltip="Edit" onClick={() => editAnswer(answer)}>
            <EditIcon />
          </Button>
        )}
        {canDelete && (
          <Button tooltip="Delete" onClick={() => handleDeleteAnswer(answer)}>
            <TrashIcon />
          </Button>
        )}
      </div>
    </div>
  );
};
