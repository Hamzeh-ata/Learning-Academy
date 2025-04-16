import { Button } from 'primereact/button';
import { EditIcon, TrashIcon } from '@shared/components';
import { usePermissionCheck } from '@hooks';

export const FrequentlyQuestionsActions = ({ question, setSelectedQuestion, handleDelete }) => {
  const { edit, delete: canDelete } = usePermissionCheck('frequently-questions');

  return (
    <div className="flex gap-4">
      {edit && (
        <Button tooltip="Edit" onClick={() => setSelectedQuestion(question)}>
          <EditIcon />
        </Button>
      )}
      {canDelete && (
        <Button tooltip="Delete" onClick={() => handleDelete(question)}>
          <TrashIcon />
        </Button>
      )}
    </div>
  );
};
