import { Button } from 'primereact/button';
import { EditIcon, TrashIcon } from '@shared/components';
import { usePermissionCheck } from '@hooks';

export const UniversityActions = ({ university, setSelectedUniversity, handleDelete }) => {
  const { edit, delete: canDelete } = usePermissionCheck('universities');

  return (
    <div className="flex gap-4">
      {edit && (
        <Button tooltip="Edit" onClick={() => setSelectedUniversity(university)}>
          <EditIcon />
        </Button>
      )}
      {canDelete && (
        <Button tooltip="Delete" onClick={() => handleDelete(university)}>
          <TrashIcon />
        </Button>
      )}
    </div>
  );
};
