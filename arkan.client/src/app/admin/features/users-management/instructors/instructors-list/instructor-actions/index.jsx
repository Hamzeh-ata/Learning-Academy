import { Button } from 'primereact/button';
import { EditIcon, TrashIcon, FeatherIcon } from '@shared/components';
import { usePermissionCheck } from '@hooks';

export const InstructorActions = ({ instructor, setSelectedInstructor, handleDelete, handleChangePassword }) => {
  const { edit, delete: canDelete } = usePermissionCheck('instructors');

  return (
    <div className="flex gap-4">
      {edit && (
        <>
          <Button tooltip="Change Password" onClick={() => handleChangePassword(instructor)}>
            <FeatherIcon name="Lock" />
          </Button>
          <Button tooltip="Edit" onClick={() => setSelectedInstructor(instructor)}>
            <EditIcon />
          </Button>
        </>
      )}
      {canDelete && (
        <Button tooltip="Delete" onClick={() => handleDelete(instructor)}>
          <TrashIcon />
        </Button>
      )}
    </div>
  );
};
