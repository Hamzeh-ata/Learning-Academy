import { useDispatch, useSelector } from 'react-redux';
import { deleteRoles } from '@services/admin-services/roles.service';
import { selectLoading } from '@slices/admin-slices/roles.slice';
import { Button } from 'primereact/button';
import { EditIcon, TrashIcon, Loader, EyeIcon } from '@shared/components';
import AlertService from '@services/alert/alert.service';
import { usePermissionCheck } from '@hooks';

export const RolesList = ({ setSelectedRole, roles, setViewRole }) => {
  const isLoading = useSelector(selectLoading);
  const dispatch = useDispatch();

  const { edit, delete: canDelete } = usePermissionCheck();

  const handleDelete = (role) => {
    AlertService.showConfirmation({
      title: 'Confirm Delete',
      body: 'Are you sure you want delete this role',
      callback: () => dispatch(deleteRoles(role))
    });
  };

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {isLoading && (
          <tr>
            <td colSpan="3" className="text-center p-10 h-28">
              <Loader />
            </td>
          </tr>
        )}
        {!isLoading &&
          roles?.map((role) => (
            <tr key={role.id}>
              <td>{role.name}</td>
              <td>{role.description}</td>
              <td>
                <div className="flex gap-4">
                  {edit && (
                    <>
                      <Button tooltip="View Permissions" onClick={() => setViewRole(role)}>
                        <EyeIcon />
                      </Button>
                      <Button tooltip="Edit" onClick={() => setSelectedRole(role)}>
                        <EditIcon />
                      </Button>
                    </>
                  )}

                  {canDelete && (
                    <Button tooltip="Delete" onClick={() => handleDelete(role)}>
                      <TrashIcon />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};
