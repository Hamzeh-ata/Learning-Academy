import { selectChatRoomMessages } from '@/slices/client-slices/chat-room.slice';
import { useSelector } from 'react-redux';
import { ChatRoomHeader } from '../../components';
import { useUserCurrentChatRoom } from '../../hooks/userCurrentChatRoom';

export function ChatRoomStats() {
  const { selectedChatRoom } = useUserCurrentChatRoom();
  const chatRoomMessages = useSelector(selectChatRoomMessages);
  return (
    <div className="flex flex-col shadow-md rounded-2xl px-2">
      <div className="flex justify-between items-center border-b border-blue-grey-400/20">
        <ChatRoomHeader
          image={selectedChatRoom?.courseImage}
          name={selectedChatRoom?.courseName}
          status={selectedChatRoom?.status || 'Online'}
        />
      </div>

      <div className="py-2 flex flex-col gap-2">
        <div className="px-4 flex items-center gap-2">
          <p className="text-md font-semibold">{chatRoomMessages?.messages?.length}</p>
          <p className="text-md text-gray-500">Messages</p>
        </div>
        <div className="px-4 flex items-center gap-2">
          <p className="text-md font-semibold">{selectedChatRoom?.usersCount}</p>
          <p className="text-md  text-gray-500">Users</p>
        </div>
      </div>
    </div>
  );
}
