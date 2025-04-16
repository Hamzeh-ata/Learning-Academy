import { chatRoomThunks, clientChatThunks } from '@/services/client-services/chat-room.service';
import { useTabs } from './useTabs';

export const useChatRoomThunk = () => {
  const { activeIndex } = useTabs();

  return {
    chatThunks: activeIndex ? clientChatThunks : chatRoomThunks
  };
};
