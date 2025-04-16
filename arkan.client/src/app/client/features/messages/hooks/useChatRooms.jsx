import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectChatRooms, setSelectedChatRoom } from '@/slices/client-slices/chat-room.slice';
import { chatRoomThunks } from '@/services/client-services/chat-room.service';
import { useSearchParams } from 'react-router-dom';

export const useChatRooms = (activeIndex) => {
  const dispatch = useDispatch();
  const chatRooms = useSelector(selectChatRooms);
  const [filteredChatRooms, setFilteredChatRooms] = useState([]);
  const [activeChatRoom, setActiveChatRoom] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    dispatch(chatRoomThunks.getUserRooms());
  }, []);

  useEffect(() => {
    if (!activeIndex && chatRooms.rooms.length) {
      setFilteredChatRooms(chatRooms.rooms);
    }
  }, [chatRooms.rooms, activeIndex]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'Personal') {
      return;
    }

    if (chatRooms.rooms.length && !activeChatRoom) {
      const currentChatRoom = searchParams.get('chatRoom');
      if (currentChatRoom) {
        const chatRoom = chatRooms.rooms.find((e) => e.roomId === parseInt(currentChatRoom));
        chatRoom && handleActiveChatRoom(chatRoom);
      } else {
        handleActiveChatRoom();
      }
    }
  }, [chatRooms, activeChatRoom, searchParams]);

  useEffect(() => {
    if (activeChatRoom && !activeIndex) {
      dispatch(setSelectedChatRoom(activeChatRoom));
      dispatch(chatRoomThunks.getRoomChat(activeChatRoom.roomId));
      dispatch(chatRoomThunks.getRoomUsers(activeChatRoom.roomId));
      dispatch(chatRoomThunks.getRoomAttachments(activeChatRoom.roomId));
    }
  }, [activeChatRoom, activeIndex, dispatch]);

  const handleActiveChatRoom = (item) => {
    if (item) {
      setActiveChatRoom(item);
    } else {
      setActiveChatRoom(chatRooms.rooms[0]);
      const tab = searchParams.get('tab');
      setSearchParams({ tab, chatRoom: chatRooms.rooms[0].roomId });
    }
  };

  const handleFilterChatRooms = (value) => {
    setFilteredChatRooms(
      value
        ? chatRooms.rooms.filter((item) => item.courseName.toLowerCase().includes(value.toLowerCase()))
        : chatRooms.rooms
    );
  };

  return {
    chatRooms,
    filteredChatRooms,
    handleFilterChatRooms,
    activeChatRoom,
    handleActiveChatRoom
  };
};
