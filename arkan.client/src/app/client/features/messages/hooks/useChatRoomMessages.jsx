import { selectChatRoomMessages } from '@/slices/client-slices/chat-room.slice';
import { useTabs } from './useTabs';
import { useSelector } from 'react-redux';
import { selectClientChatMessages } from '@/slices/client-slices/client-chat.slice';

export const useChatRoomMessages = () => {
  const { messages: chatRoomMessages } = useSelector(selectChatRoomMessages);
  const { messages: clientRoomMessages } = useSelector(selectClientChatMessages);
  const { activeIndex } = useTabs();

  return { messages: activeIndex === 0 ? chatRoomMessages : clientRoomMessages };
};
