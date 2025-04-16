import { deleteAdmin } from '@/services/admin-services/user-services';
import alertService from '@/services/alert/alert.service';
import { selectAdminsLoading } from '@/slices/admin-slices/user-slices';
import { usePermissionCheck } from '@hooks';
import { EditIcon, FeatherIcon, Loader, TrashIcon } from '@shared/components';
import { getImageFullPath } from '@utils/image-path';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { useDispatch, useSelector } from 'react-redux';

export const AdminList = ({ setSelectedAdmin, admins, handleChangePassword }) => {
  const isLoading = useSelector(selectAdminsLoading);
  const dispatch = useDispatch();

  const { edit, delete: canDelete } = usePermissionCheck('admins');

  const handleDelete = (admin) => {
    alertService.showConfirmation({
      title: 'Confirm Delete',
      body: 'Are you sure you want delete this admin',
      callback: () => dispatch(deleteAdmin(admin))
    });
  };

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Roles</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {isLoading && (
          <tr>
            <td colSpan="4" className="text-center p-10 h-28">
              <Loader />
            </td>
          </tr>
        )}
        {!isLoading &&
          admins?.map((admin) => (
            <tr key={admin.id}>
              <td>
                <div className="flex items-center gap-4 max-w-[30rem]">
                  <img
                    className="rounded-full shadow-xl w-14 h-14 object-fill"
                    src={getImageFullPath(admin.image)}
                    alt={'Category'}
                  />
                  <Tooltip target={`.category-title-${admin.id}`}>
                    <p className="flex text-left text-md max-w-56 w-fit">
                      {admin.firstName} {admin.lastName}
                    </p>
                  </Tooltip>
                  <p className={`line-clamp-2 break-all category-title-${admin.id}`}>
                    {admin.firstName} {admin.lastName}
                  </p>
                </div>
              </td>
              <td>{admin.email}</td>
              <td>{admin.roles.length > 0 ? `Admin, ${admin.roles.map((e) => e.name).join(', ')}` : 'Admin'}</td>
              <td>
                <div className="flex gap-4">
                  {edit && (
                    <>
                      <Button tooltip="Change Password" onClick={() => handleChangePassword(admin)}>
                        <FeatherIcon name="Lock" />
                      </Button>
                      <Button tooltip="Edit" onClick={() => setSelectedAdmin(admin)}>
                        <EditIcon />
                      </Button>
                    </>
                  )}

                  {canDelete && (
                    <Button tooltip="Delete" onClick={() => handleDelete(admin)}>
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
