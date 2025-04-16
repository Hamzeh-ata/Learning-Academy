import { useDispatch, useSelector } from 'react-redux';
import { ChatRoomHeader } from '.';
import { MessagesList } from './messages-list';
import { ChatBotThunks } from '@/services/shared/chatbot.service';
import messageSentSound from '@assets/sounds/notification-sent.mp3';
import { useEffect, useRef } from 'react';
import signalRService from '@/services/signalr-service';
import messageReceivedSound from '@assets/sounds/notification.mp3';
import { selectUserProfile } from '@/slices/client-slices/user-profile.slice';
import { addMessage, getSelectedChatBotRoom } from '@/slices/shared/chatbot.slice';
import { ChatForm } from './chat-form';

export function RoomMessages() {
  const selectedChatRoom = useSelector(getSelectedChatBotRoom);
  const userProfile = useSelector(selectUserProfile);

  const dispatch = useDispatch();
  const messageSentAudioRef = useRef(new Audio(messageSentSound));
  const messageAudioRef = useRef(new Audio(messageReceivedSound));

  useEffect(() => {
    if (selectedChatRoom) {
      handleSocketEvents();
    }
  }, [selectedChatRoom]);

  const handleSendMessage = (value) => {
    const message = {
      content: value.content,
      chatRoomId: selectedChatRoom.roomId
    };
    if (value.file) {
      message.file = value.file;
    }
    dispatch(ChatBotThunks.sendMessage(message));
    messageSentAudioRef.current.play();
  };
  function handleSocketEvents() {
    const roomId = selectedChatRoom?.roomId?.toString();

    signalRService.subscribeToNotifications(roomId);

    signalRService.onMessageReceived('ReceiveSupportMessage', (message) => {
      if (selectedChatRoom && selectedChatRoom.roomId === message.roomId) {
        dispatch(addMessage(message));

        if (message.senderId !== userProfile.userId) {
          messageAudioRef.current.play();
        }
      }
    });
  }

  return (
    <div className="flex flex-col h-full justify-between ms-2">
      <div className="flex items-center bg-slate-900 rounded-t-xl">
        <ChatRoomHeader
          image={selectedChatRoom?.senderImage}
          name={selectedChatRoom?.senderName || 'User'}
          status={selectedChatRoom?.isOnline ? 'Online' : 'Offline'}
        />
      </div>
      <MessagesList />

      <div className="w-full bg-slate-900 flex self-end px-2 rounded-b-xl">
        <ChatForm onSubmit={handleSendMessage} />
      </div>
    </div>
  );
}
