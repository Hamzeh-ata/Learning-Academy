import { FeatherIcon, TabComponent, TabsCard } from '@/app/shared/components';
import { CoursesMessages } from '@(admin)/features/courses-inbox';
import { useEffect } from 'react';
import { chatRoomThunks } from '@/services/admin-services/courses-chat.service';
import { useDispatch } from 'react-redux';

export default function CoursesInbox() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(chatRoomThunks.GetUserRooms());
  }, []);

  return (
    <TabsCard title="Courses Inbox" icon={<FeatherIcon size={35} className="text-orange-400" name="Inbox" />}>
      <TabComponent tabTitle={'Courses Messages'}>
        <CoursesMessages />
      </TabComponent>
    </TabsCard>
  );
}
