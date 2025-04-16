import { FeatherIcon, PlusIcon, SidebarPanel, TabComponent, TabsCard } from '@/app/shared/components';
import { useDispatch, useSelector } from 'react-redux';
import { usePermissionCheck } from '@/hooks';
import { useEffect, useState } from 'react';
import { adminNotificationsThunks, selectAllNotifications } from '@/slices/admin-slices/admin-notifications.slice';
import { NotificationEntry, NotificationsList } from '@(admin)/features/admin-notifications';

export default function Notifications() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const notifications = useSelector(selectAllNotifications);

  const { create } = usePermissionCheck();

  useEffect(() => {
    if (notifications?.length) {
      return;
    }
    dispatch(adminNotificationsThunks.fetchAll());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resetForm() {
    setSelectedNotification(null);
    setIsModalOpen(false);
  }

  function onEdit(notification) {
    setSelectedNotification(notification);
    setIsModalOpen(true);
  }

  const NotificationListHeader = () => (
    <div className="flex justify-between mb-6 text-lg font-semibold text-gray-200">
      <div>Notifications List</div>
      {create && (
        <button
          onClick={() => {
            setIsModalOpen(true);
          }}
          className="text-orange-500"
        >
          <PlusIcon />
        </button>
      )}
    </div>
  );

  return (
    <TabsCard title="Notifications" icon={<FeatherIcon size={35} className="text-orange-400" name="Bell" />}>
      <TabComponent title={<NotificationListHeader />} tabTitle={'Notifications'}>
        <NotificationsList onEdit={onEdit} />
        <SidebarPanel
          isVisible={isModalOpen}
          position={'right'}
          onHide={resetForm}
          isDismissible
          title={`${selectedNotification ? 'Edit' : 'Add'} Notification`}
        >
          <NotificationEntry notification={selectedNotification} onSubmitted={resetForm} />
        </SidebarPanel>
      </TabComponent>
    </TabsCard>
  );
}
