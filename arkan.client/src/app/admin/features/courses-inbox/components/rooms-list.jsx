import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedChatRoom, selectChatRooms } from '@/slices/admin-slices/courses-chat.slice';
import { chatRoomThunks } from '@/services/admin-services/courses-chat.service';
import { ChatRoomSearch } from '.';
import { formatTimeStamp } from '@utils/date-format';
import { FeatherIcon } from '@/app/shared/components';

export function RoomsList() {
  const supportChatRooms = useSelector(selectChatRooms);
  const [filteredChatRooms, setFilteredChatRooms] = useState([]);
  const [activeChatRoom, setActiveChatRoom] = useState(null);
  const [showUsers, setShowUsers] = useState(false);
  const [roomUsers, setRoomUsers] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (supportChatRooms?.rooms?.length) {
      setFilteredChatRooms(supportChatRooms.rooms);
      if (!activeChatRoom) {
        handleActiveChatRoom(supportChatRooms.rooms[0]);
      } else {
        const updatedActiveRoom = supportChatRooms.rooms.find((room) => room.roomId === activeChatRoom.roomId);
        if (updatedActiveRoom) {
          setActiveChatRoom(updatedActiveRoom);
        } else {
          handleActiveChatRoom(supportChatRooms.rooms[0]);
        }
      }
    }
  }, [supportChatRooms, activeChatRoom]);

  useEffect(() => {
    if (showUsers && roomUsers.length === 0 && activeChatRoom) {
      dispatch(chatRoomThunks.getRoomUsers(activeChatRoom.roomId))
        .then((response) => {
          setRoomUsers(response.payload);
        })
        .catch((error) => {
          console.error('Error fetching room users:', error);
        });
    }
  }, [showUsers, roomUsers, activeChatRoom, dispatch]);

  const handleActiveChatRoom = (item) => {
    if (item) {
      setActiveChatRoom(item);
      dispatch(setSelectedChatRoom(item));
      dispatch(chatRoomThunks.getRoomChat(item.roomId));
      setRoomUsers([]);
    }
  };

  const handleToggleStudentMute = (mute, userId, roomId) => {
    dispatch(chatRoomThunks.muteStudent({ isMuted: mute, studentUserId: userId, roomId }))
      .then(() => {
        const updatedUsers = roomUsers.map((user) => {
          if (user.userId === userId) {
            return { ...user, isMuted: mute };
          }
          return user;
        });
        setRoomUsers(updatedUsers);
      })
      .catch((error) => {
        console.error('Error toggling mute:', error);
      });
  };

  const handleFilterChatRooms = (value) => {
    setFilteredChatRooms(
      value
        ? supportChatRooms.rooms.filter((item) => item.courseName?.toLowerCase().includes(value.toLowerCase()))
        : supportChatRooms.rooms
    );
  };

  const handleShowUsers = () => {
    setShowUsers(true);
  };

  const toggleUsersList = () => {
    setShowUsers(false);
  };

  return (
    <div className="overflow-y-auto p-4 pt-8 h-full max-h-[calc(100vh-80px)] flex flex-col gap-2">
      <ChatRoomSearch onSearch={handleFilterChatRooms} />
      {showUsers
        ? roomUsers.map((user) => (
            <div key={user.userId} className="cursor-pointer flex">
              <div>{user.userName}</div>
              {!user.isMuted ? (
                <button
                  className="tooltip text-white"
                  onClick={() => handleToggleStudentMute(true, user.userId, activeChatRoom.roomId)}
                >
                  <FeatherIcon name="Mic" className="text-blue-600 hover:line-through" size={20} />
                </button>
              ) : (
                <button
                  className="tooltip text-white"
                  onClick={() => handleToggleStudentMute(false, user.userId, activeChatRoom.roomId)}
                >
                  <FeatherIcon name="MicOff" className="text-red-600" size={20} />
                </button>
              )}
            </div>
          ))
        : filteredChatRooms.map((room) => (
            <div
              key={room.roomId}
              className={`cursor-pointer p-2 rounded-md ${activeChatRoom?.roomId === room.roomId ? 'bg-gray-200' : ''}`}
              onClick={() => handleActiveChatRoom(room)}
            >
              <div>{room.courseName}</div>
              <div>{room.lastMessageContent}</div>
              <div>{formatTimeStamp(room.lastMessageTimestamp) || '12:00 AM'}</div>
              <button className="mt-2 p-2 bg-blue-500 text-white rounded-md" onClick={() => handleShowUsers()}>
                Show Users
              </button>
            </div>
          ))}
      {showUsers && (
        <button className="p-2 mt-4 bg-blue-500 text-white rounded-md" onClick={toggleUsersList}>
          Show Rooms
        </button>
      )}
    </div>
  );
}
