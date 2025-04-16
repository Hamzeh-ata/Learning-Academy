import { selectChatRooms } from '@/slices/client-slices/chat-room.slice';
import { useSelector } from 'react-redux';
import { AttachmentsList } from './components/attachments-list';
import { ChatRoomStats } from './components/chat-room-stats';
import { ChatRoomUsers } from './components/chat-room-users';
import { ChatRoomInfoToggle } from '../components/chat-room-info-toggle';

export function RoomInfo({ setShowRoomInfo, showRoomInfo }) {
  const chatRoom = useSelector(selectChatRooms);

  return (
    <div className="animate-fade-left bg-white flex flex-col p-4 min-w-[200px] overflow-y-auto pt-4 h-full max-h-[calc(100vh-80px)] gap-4 border-l border-blue-grey-50">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-semibold">Room info</h3>
        <ChatRoomInfoToggle setShowRoomInfo={setShowRoomInfo} showRoomInfo={showRoomInfo} />
      </div>

      <ChatRoomStats />
      <ChatRoomUsers users={chatRoom.users} />

      <AttachmentsList attachments={chatRoom.attachments} />
    </div>
  );
}
