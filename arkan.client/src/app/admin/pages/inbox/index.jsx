import { FeatherIcon, TabComponent, TabsCard } from '@/app/shared/components';
import { SupportMessages } from '@(admin)/features/inbox';
import { useEffect } from 'react';
import { ChatBotThunks } from '@/services/shared/chatbot.service';
import { useDispatch } from 'react-redux';

export default function Inbox() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(ChatBotThunks.getRooms());
  }, []);

  return (
    <TabsCard title="Admin Inbox" icon={<FeatherIcon size={35} className="text-orange-400" name="Inbox" />}>
      <TabComponent tabTitle={'Messages'}>
        <SupportMessages />
      </TabComponent>
    </TabsCard>
  );
}
