import signalRService from '@/services/signalr-service';
import { toggleStudentMute } from '@/slices/client-slices/chat-room.slice';
import emptyCoursesList from '@assets/images/empty-chatroom.svg';
import messageSentSound from '@assets/sounds/notification-sent.mp3';
import messageReceivedSound from '@assets/sounds/notification.mp3';
import { getImageFullPath } from '@utils/image-path';
import { Avatar } from 'primereact/avatar';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ChatRoomHeader, ChatRoomInfoToggle } from '../components';
import { MessagesList } from '../messages-list';
import { ChatForm } from './components/chat-form';
import { useUserCurrentChatRoom } from '../hooks/userCurrentChatRoom';
import { useChatRoomThunk } from '../hooks/useChatRoomThunk';
import { useTabs } from '../hooks/useTabs';
import { useChatActions } from '../hooks/useChatActions';

export function ChatRoomContent({ setShowRoomInfo, showRoomInfo }) {
  const dispatch = useDispatch();
  const typingTimeoutRef = useRef(null);
  const { selectedChatRoom } = useUserCurrentChatRoom();
  const [isTyping, setIsTyping] = useState(null);
  const [parentMessage, setParentMessage] = useState(null);
  const messageAudioRef = useRef(new Audio(messageReceivedSound));
  const messageSentAudioRef = useRef(new Audio(messageSentSound));
  const { chatThunks } = useChatRoomThunk();
  const { activeIndex } = useTabs();
  const { addMessage, deleteMessage, deleteMessageEmoji, updateMessageEmoji } = useChatActions();

  useEffect(() => {
    if (selectedChatRoom?.roomId) {
      handleSocketEvents();
    }
  }, [selectedChatRoom]);

  if (!selectedChatRoom?.roomId) {
    return (
      <div className="flex flex-col justify-center items-center h-full">
        <p className="text-gray-600 mb-2">You don`t have any chat Rooms</p>
        <img src={emptyCoursesList} alt="empty courses" />
      </div>
    );
  }

  function handleSocketEvents() {
    signalRService.subscribeToNotifications(selectedChatRoom.roomId?.toString());

    signalRService.onMessageReceived('ReceiveChatRoomMessage', (message) => {
      dispatch(addMessage(message));
      messageAudioRef.current.play();
    });

    signalRService.onMessageReceived('MessageDeleted', (message) => {
      dispatch(deleteMessage(message));
      messageAudioRef.current.play();
    });

    signalRService.onMessageReceived('ReactionAdded', (message) => {
      dispatch(updateMessageEmoji(message));
      messageAudioRef.current.play();
    });

    signalRService.onMessageReceived('ReactionRemoved', (message) => {
      dispatch(deleteMessageEmoji(message));
    });

    signalRService.onMessageReceived('MuteListener', (message) => {
      dispatch(toggleStudentMute(message));
    });

    signalRService.onMessageReceived('UserTyping', (message) => {
      setIsTyping(message);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(null);
      }, 2000);
    });
  }
  console.log(selectedChatRoom);
  const handleSendMessage = (value) => {
    const message = {
      content: value.content,
      courseId: selectedChatRoom.courseId,
      receiverId: selectedChatRoom.receiverId
    };
    if (value.file) {
      message.file = value.file;
    }
    if (value.parentMessageID) {
      message.parentMessageID = value.parentMessageID;
    }
    dispatch(chatThunks.sendMessage(message));
    messageSentAudioRef.current.play();
  };

  return (
    <div className="flex flex-col gap-2 bg-gray-200/50 h-full justify-between">
      <div className="flex justify-between items-center border-b border-blue-grey-400/40">
        <ChatRoomHeader
          image={selectedChatRoom?.courseImage}
          name={selectedChatRoom?.courseName}
          status={selectedChatRoom?.status || 'Online'}
        />
        {!activeIndex && !showRoomInfo && (
          <ChatRoomInfoToggle setShowRoomInfo={setShowRoomInfo} showRoomInfo={showRoomInfo} />
        )}
      </div>

      <MessagesList setParentMessage={setParentMessage} />

      {!selectedChatRoom.isMuted && (
        <>
          <span className="text-xs px-4 py-2 animate-pulse text-orange-400 flex items-center">
            {isTyping?.image && (
              <Avatar image={getImageFullPath(isTyping.image)} size="normal" className="mr-2 w-6 h-6" shape="circle" />
            )}
            {isTyping?.name && <span className="me-2">{isTyping.name} is typing...</span>}
          </span>
          <div className="w-full bg-white flex self-end">
            <ChatForm
              onSubmit={handleSendMessage}
              parentMessage={parentMessage}
              setParentMessage={setParentMessage}
              roomId={selectedChatRoom?.roomId}
            />
          </div>
        </>
      )}
    </div>
  );
}
