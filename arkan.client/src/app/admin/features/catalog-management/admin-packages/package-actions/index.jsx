import { usePermissionCheck } from '@hooks';
import { Button } from 'primereact/button';
import { EditIcon, TrashIcon } from '@shared/components';

export const PackageActions = ({ onDelete, onEdit }) => {
  const { edit, delete: canDelete } = usePermissionCheck('packages');

  return (
    <div className="flex gap-4">
      {edit && (
        <Button tooltip="Edit" onClick={onEdit}>
          <EditIcon />
        </Button>
      )}
      {canDelete && (
        <Button tooltip="Delete" onClick={onDelete}>
          <TrashIcon />
        </Button>
      )}
    </div>
  );
};
