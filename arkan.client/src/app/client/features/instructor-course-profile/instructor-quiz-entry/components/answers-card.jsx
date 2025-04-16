import { useDispatch } from 'react-redux';
import { answersThunks } from '@services/client-services/instructor-course-profile.service';
import alertService from '@services/alert/alert.service';
import { EditIcon, TrashIcon } from '@shared/components';
import { Button } from 'primereact/button';
import { getImageFullPath } from '@utils/image-path';

export const AnswersCard = ({ editAnswer, answer }) => {
  const dispatch = useDispatch();

  const handleDeleteAnswer = (answerId) => {
    alertService.showConfirmation({
      title: 'Confirm Delete',
      body: 'Are you sure you want delete this answer',
      callback: () => dispatch(answersThunks.delete(answerId))
    });
  };

  return (
    <div
      key={answer.id}
      className={`text-left flex gap-2 p-2 rounded-lg justify-between shadow-md border flex-wrap ${answer.isCorrect ? 'border-teal-400' : 'border-red-400'} `}
    >
      <div className="rounded-lg p-2 flex items-center gap-2 flex-wrap">
        {answer.image && (
          <img
            src={getImageFullPath(answer.image)}
            alt={answer.title}
            className="w-16 h-16 object-cover rounded-3xl bg-white"
          />
        )}
        <div>
          <p className="font-semibold text-gray-600 line-clamp-2">Title: {answer.title}</p>
          {answer.image && <p className="text-md text-gray-500 line-clamp-1">Description: {answer.description}</p>}
        </div>
      </div>
      <div className="flex gap-4 flex-col justify-center">
        <Button tooltip="Edit" onClick={() => editAnswer(answer)}>
          <EditIcon />
        </Button>
        <Button tooltip="Delete" onClick={() => handleDeleteAnswer(answer.id)}>
          <TrashIcon />
        </Button>
      </div>
    </div>
  );
};
