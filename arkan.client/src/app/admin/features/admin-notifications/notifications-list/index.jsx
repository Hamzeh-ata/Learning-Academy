import { EditIcon, Loader, TrashIcon } from '@/app/shared/components';
import { DROP_DOWN_TYPES, NOTIFICATION_TYPE } from '@/constants';
import { useDropdownData, usePermissionCheck } from '@/hooks';
import alertService from '@services/alert/alert.service';
import {
  adminNotificationsThunks,
  selectAllNotifications,
  selectLoading
} from '@/slices/admin-slices/admin-notifications.slice';
import { getKeyByValue, humanizeWords } from '@utils/helpers';
import { Button } from 'primereact/button';
import { useDispatch, useSelector } from 'react-redux';

export function NotificationsList({ onEdit }) {
  const notifications = useSelector(selectAllNotifications);
  const { courses, packages } = useDropdownData([DROP_DOWN_TYPES.Courses, DROP_DOWN_TYPES.Packages]);

  const isLoading = useSelector(selectLoading);
  const dispatch = useDispatch();
  const { delete: canDelete, edit } = usePermissionCheck();

  function handleDelete(notificationId) {
    alertService.showConfirmation({
      title: 'Delete Notifications',
      body: `Are you sure you want to delete this notification`,
      callback: () => dispatch(adminNotificationsThunks.delete(notificationId))
    });
  }

  function getItemName(itemId, type) {
    if (!itemId) {
      return 'N/A';
    }

    const item = notificationTypeItems[type]?.find((item) => item.id === itemId);
    return item?.name;
  }

  const notificationTypeItems = {
    [NOTIFICATION_TYPE.Course]: courses,
    [NOTIFICATION_TYPE.Package]: packages,
    [NOTIFICATION_TYPE.Announcements]: []
  };

  return (
    <div className="flex flex-col gap-3 pt-2 pb-2">
      {!isLoading && !notifications?.length && (
        <div className="flex flex-col justify-center items-center">
          <p className="text-gray-400 text-lg mb-2">No Result Found</p>
        </div>
      )}

      {!!notifications?.length && (
        <table className="table">
          <thead>
            <tr>
              <th>Content</th>
              <th>Type</th>
              <th>Item</th>
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
              notifications?.map((notification) => (
                <tr key={notification.id}>
                  <td className="break-all truncate max-w-[200px]">{notification.message}</td>
                  <td>{humanizeWords(getKeyByValue(NOTIFICATION_TYPE, notification.type))}</td>
                  <td className="break-all truncate max-w-[200px]">
                    {getItemName(notification.itemId, notification.type)}
                  </td>
                  <td>
                    <div className="flex gap-4">
                      {canDelete && (
                        <Button tooltip="Delete" onClick={() => handleDelete(notification.id)}>
                          <TrashIcon />
                        </Button>
                      )}
                      {edit && (
                        <Button tooltip="Edit" onClick={() => onEdit(notification)}>
                          <EditIcon />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
