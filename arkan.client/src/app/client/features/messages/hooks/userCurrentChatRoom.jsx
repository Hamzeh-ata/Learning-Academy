import { getSelectedChatRoom } from '@/slices/client-slices/chat-room.slice';
import { getSelectClientChatRoom } from '@/slices/client-slices/client-chat.slice';
import { useSelector } from 'react-redux';
import { useTabs } from './useTabs';

export const useUserCurrentChatRoom = () => {
  const selectedChatRoom = useSelector(getSelectedChatRoom);
  const clientSelectedChatRoom = useSelector(getSelectClientChatRoom);
  const { activeIndex } = useTabs();

  return {
    selectedChatRoom: activeIndex === 0 ? selectedChatRoom : clientSelectedChatRoom
  };
};
