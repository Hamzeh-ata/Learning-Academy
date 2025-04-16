import { Button } from 'primereact/button';
import { TrashIcon, AcceptIcon } from '@shared/components';
import { usePermissionCheck } from '@hooks';

export const ChangePasswordRequestsActions = ({ request, setSelectedRequest, handleDelete }) => {
  const { edit, delete: canDelete } = usePermissionCheck();
  return (
    <div className="flex gap-4">
      {edit && (
        <Button tooltip="Accept" onClick={() => setSelectedRequest(request)}>
          <AcceptIcon />
        </Button>
      )}
      {canDelete && (
        <Button tooltip="Delete" onClick={() => handleDelete(request)}>
          <TrashIcon />
        </Button>
      )}
    </div>
  );
};
