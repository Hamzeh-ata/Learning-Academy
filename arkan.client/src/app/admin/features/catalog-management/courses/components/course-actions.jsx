import { Button } from 'primereact/button';
import { EditIcon, TrashIcon } from '@shared/components';
import { usePermissionCheck } from '@hooks';

export const CourseActions = ({ course, setSelectedCourse, handleDelete }) => {
  const { edit, delete: canDelete } = usePermissionCheck('courses');

  return (
    <div className="flex gap-4">
      {edit && (
        <Button tooltip="Edit" onClick={() => setSelectedCourse(course)}>
          <EditIcon />
        </Button>
      )}
      {canDelete && (
        <Button tooltip="Delete" onClick={() => handleDelete(course)}>
          <TrashIcon />
        </Button>
      )}
    </div>
  );
};
