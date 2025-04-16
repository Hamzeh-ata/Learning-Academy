import { addPagePermission } from '@services/admin-services/roles.service';
import { selectPermissions } from '@slices/admin-slices/roles.slice';
import { InputSwitch } from 'primereact/inputswitch';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const RolesPermissions = ({ role, onSubmitted }) => {
  const dispatch = useDispatch();
  const rolePermissions = useSelector(selectPermissions);
  const [permissionsState, setPermissionsState] = useState({});
  const [pendingChanges, setPendingChanges] = useState({
    roleId: role?.id,
    permissions: []
  });

  useEffect(() => {
    const initialState = {};
    const initialChanges = {
      roleId: role.id,
      permissions:
        rolePermissions.pagePermissions?.map((page) => ({
          pageId: page.pageId,
          permissionIds: [...new Set(page.permissions)]
        })) || []
    };

    rolePermissions.pagePermissions?.forEach((page) => {
      // Initialize permissionsState
      initialState[page.pageId] = page.permissions.reduce((acc, curr) => {
        acc[curr] = true; // Initialize state as true for existing permissions
        return acc;
      }, {});
    });

    setPermissionsState(initialState);
    setPendingChanges(initialChanges);
  }, [rolePermissions, role.id]);

  const handlePermissionChange = (pageId, permissionId, isChecked) => {
    setPermissionsState((prev) => ({
      ...prev,
      [pageId]: {
        ...prev[pageId],
        [permissionId]: isChecked
      }
    }));

    setPendingChanges((prev) => {
      let updatedPermissions = [...prev.permissions];
      const pageIndex = updatedPermissions.findIndex((p) => p.pageId === pageId);

      if (pageIndex !== -1) {
        let permissionIdsSet = new Set(updatedPermissions[pageIndex].permissionIds);
        if (isChecked) {
          permissionIdsSet.add(permissionId);
        } else {
          permissionIdsSet.delete(permissionId);
        }
        updatedPermissions[pageIndex].permissionIds = [...permissionIdsSet];
      } else if (isChecked) {
        updatedPermissions.push({ pageId, permissionIds: [permissionId] });
      }

      return { ...prev, permissions: updatedPermissions };
    });
  };

  const saveChanges = () => {
    dispatch(addPagePermission(pendingChanges));
    onSubmitted(true);
  };

  return (
    <div className="">
      <table className="table">
        <thead>
          <tr>
            <th>Page Name</th>
            <th>
              Permissions:
              <div className="flex gap-4 mt-2">
                {rolePermissions.permissions.map((permission) => (
                  <div key={permission.id} className="mr-4">
                    <label>{permission.name}</label>
                  </div>
                ))}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {rolePermissions.pagePermissions?.map((page) => (
            <tr key={page.pageId}>
              <td>{page.pageName}</td>
              <td>
                <div className="flex  align-center gap-6">
                  {rolePermissions.permissions.map((permission) => (
                    <InputSwitch
                      key={permission.id}
                      id={`permission-${permission.id}-${page.pageId}`}
                      checked={permissionsState[page.pageId] && permissionsState[page.pageId][permission.id]}
                      onChange={(e) => handlePermissionChange(page.pageId, permission.id, e.value)}
                    />
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <button className="btn" onClick={saveChanges}>
          Save Changes
        </button>
      </div>
    </div>
  );
};
