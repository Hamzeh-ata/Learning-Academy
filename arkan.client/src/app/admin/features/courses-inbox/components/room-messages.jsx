import { useSelector } from 'react-redux';
import { ChatRoomHeader } from '.';
import { MessagesList } from './messages-list';
import { getSelectedChatRoom } from '@/slices/admin-slices/courses-chat.slice';
export function RoomMessages() {
  const selectedChatRoom = useSelector(getSelectedChatRoom);
  return (
    <div className="flex flex-col h-full justify-between ms-2">
      <div className="flex items-center bg-slate-900 rounded-t-xl">
        <ChatRoomHeader
          image={selectedChatRoom?.courseImage}
          name={selectedChatRoom?.courseName || 'User'}
          status="Online"
        />
      </div>
      <MessagesList />
    </div>
  );
}
