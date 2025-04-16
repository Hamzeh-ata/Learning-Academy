import { Button } from 'primereact/button';
import { EditIcon, TrashIcon, EyeIcon } from '@shared/components';
import { usePermissionCheck } from '@hooks';

export const CategoryActions = ({ category, viewCategoryCourses, setSelectedCategory, handleDelete, coursesCount }) => {
  const { edit, delete: canDelete } = usePermissionCheck('categories');

  return (
    <div className="flex gap-4">
      {!!coursesCount && (
        <Button tooltip="View Courses" onClick={() => viewCategoryCourses(category)}>
          <EyeIcon />
        </Button>
      )}
      {edit && (
        <Button tooltip="Edit" onClick={() => setSelectedCategory(category)}>
          <EditIcon />
        </Button>
      )}
      {canDelete && (
        <Button tooltip="Delete" onClick={() => handleDelete(category)}>
          <TrashIcon />
        </Button>
      )}
    </div>
  );
};
