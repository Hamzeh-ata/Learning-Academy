import { selectChatBotRooms, setSelectedChatRoom } from '@/slices/shared/chatbot.slice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChatRoomSearch } from '.';
import { ChatBotThunks } from '@/services/shared/chatbot.service';
import { RoomItem } from './room-item';

export function RoomsList() {
  const supportChatRooms = useSelector(selectChatBotRooms);
  const [filteredChatRooms, setFilteredChatRooms] = useState([]);
  const [activeChatRoom, setActiveChatRoom] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (supportChatRooms?.rooms?.length) {
      setFilteredChatRooms(supportChatRooms.rooms);
      handleActiveChatRoom(supportChatRooms.rooms?.[0]);
    }
  }, [supportChatRooms]);

  const handleActiveChatRoom = (item) => {
    if (item) {
      setActiveChatRoom(item);
      dispatch(setSelectedChatRoom(item));
      dispatch(ChatBotThunks.getRoomMessages(item.roomId));
    }
  };

  const handleFilterChatRooms = (value) => {
    setFilteredChatRooms(
      value
        ? supportChatRooms.rooms.filter((item) => item.courseName?.toLowerCase().includes(value.toLowerCase()))
        : supportChatRooms.rooms
    );
  };

  return (
    <div className="overflow-y-auto p-4 pt-8 h-full max-h-[calc(100vh-80px)] flex flex-col gap-2">
      <ChatRoomSearch onSearch={handleFilterChatRooms} />
      {filteredChatRooms.map((room) => (
        <div className="flex flex-col gap-2 border-b border-blue-grey-300/60" key={room.roomId}>
          <RoomItem onClick={handleActiveChatRoom} room={room} activeRoomId={activeChatRoom?.roomId} />
        </div>
      ))}
    </div>
  );
}
