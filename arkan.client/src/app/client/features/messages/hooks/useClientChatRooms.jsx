import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectClientChatRooms, setSelectedClientChatRoom } from '@/slices/client-slices/client-chat.slice';
import { clientChatThunks } from '@/services/client-services/chat-room.service';
import { useSearchParams } from 'react-router-dom';

export const useClientChatRooms = (activeIndex) => {
  const dispatch = useDispatch();
  const clientChatRoom = useSelector(selectClientChatRooms);
  const [filteredChatRooms, setFilteredChatRooms] = useState([]);
  const [activeChatRoom, setActiveChatRoom] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    dispatch(clientChatThunks.getRooms());
  }, []);

  useEffect(() => {
    if (activeIndex && clientChatRoom.rooms.length) {
      setFilteredChatRooms(clientChatRoom.rooms);
    }
  }, [clientChatRoom.rooms, activeIndex]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'Groups') {
      return;
    }
    if (clientChatRoom.rooms.length && !activeChatRoom) {
      const currentChatRoom = searchParams.get('chatRoom');
      const currentUserId = searchParams.get('userId');
      if (currentChatRoom) {
        const chatRoom = clientChatRoom.rooms.find((e) => e.roomId === parseInt(currentChatRoom));
        chatRoom && handleActiveChatRoom(chatRoom);
      } else if (currentUserId) {
        const chatRoom = clientChatRoom.rooms.find((e) => e.receiverId === currentUserId);
        chatRoom && handleActiveChatRoom(chatRoom);
      } else {
        handleActiveChatRoom();
      }
    }
  }, [clientChatRoom, activeChatRoom, searchParams]);

  useEffect(() => {
    if (activeChatRoom && activeIndex) {
      dispatch(setSelectedClientChatRoom(activeChatRoom));
      dispatch(clientChatThunks.getRoomChat(activeChatRoom.roomId));
    }
  }, [activeChatRoom, activeIndex, dispatch]);

  const handleActiveChatRoom = (item) => {
    if (item) {
      setActiveChatRoom(item);
    } else {
      setActiveChatRoom(clientChatRoom.rooms[0]);
      const tab = searchParams.get('tab');
      setSearchParams({ tab, chatRoom: clientChatRoom.rooms[0].roomId });
    }
  };

  const handleFilterChatRooms = (value) => {
    setFilteredChatRooms(
      value
        ? clientChatRoom.rooms.filter((item) => item.courseName.toLowerCase().includes(value.toLowerCase()))
        : clientChatRoom.rooms
    );
  };

  return {
    clientChatRoom,
    filteredChatRooms,
    handleFilterChatRooms,
    activeChatRoom,
    handleActiveChatRoom
  };
};
