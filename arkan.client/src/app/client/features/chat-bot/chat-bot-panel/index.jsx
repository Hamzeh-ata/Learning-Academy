import { ChatBotHeader } from '../chat-bot-header';
import { ChatBotForm } from '../chat-bot-form';
import { ChatBotMessages } from '../chat-bot-messages';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, selectChatBotMessages, selectChatBotSelectedRoomId } from '@/slices/shared/chatbot.slice';
import { useEffect, useRef } from 'react';
import signalRService from '@/services/signalr-service';
import messageReceivedSound from '@assets/sounds/notification.mp3';
import messageSentSound from '@assets/sounds/notification-sent.mp3';
import { ChatBotThunks } from '@/services/shared/chatbot.service';
import { selectUserProfile } from '@/slices/client-slices/user-profile.slice';

export const ChatBotPanel = ({ setIsPanelVisible }) => {
  const chatRoomId = useSelector(selectChatBotSelectedRoomId);
  const dispatch = useDispatch();
  const messageAudioRef = useRef(new Audio(messageReceivedSound));
  const messageSentAudioRef = useRef(new Audio(messageSentSound));
  const messageContainerRef = useRef(null);
  let { messages } = useSelector(selectChatBotMessages);
  const userProfile = useSelector(selectUserProfile);

  useEffect(() => {
    if (chatRoomId) {
      handleSocketEvents();
      dispatch(ChatBotThunks.getRoomMessages(chatRoomId));
    }
  }, [chatRoomId]);

  useEffect(() => {
    if (messages.length) {
      setTimeout(() => scrollToBottom(), 200);
    }
  }, [messages]);

  function scrollToBottom() {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo(0, messageContainerRef.current.scrollHeight);
    }
  }

  function handleSocketEvents() {
    signalRService.subscribeToNotifications(chatRoomId?.toString());
    signalRService.onMessageReceived('ReceiveSupportMessage', (message) => {
      dispatch(addMessage(message));
      if (message.senderId !== userProfile.userId) {
        messageAudioRef.current.play();
      }
    });
  }

  const handleSendMessage = (value) => {
    const message = {
      content: value.content,
      chatRoomId: chatRoomId
    };
    if (value.file) {
      message.file = value.file;
    }
    dispatch(ChatBotThunks.sendMessage(message));
    messageSentAudioRef.current.play();
  };

  return (
    <div className="chat-bot__panel animate-fade-up flex flex-col h-full justify-between">
      <ChatBotHeader setIsPanelVisible={setIsPanelVisible} />
      <div
        className="flex flex-col gap-2 h-[calc(100%-150px)] overflow-y-auto overflow-x-hidden bg-gray-200/50"
        ref={messageContainerRef}
      >
        <div className="py-2 px-1 h-full flex flex-col gap-2">
          {messages.map((item, index) => (
            <ChatBotMessages key={index} message={item} type={item.senderId === userProfile.userId ? 'user' : 'bot'} />
          ))}
        </div>
      </div>
      <div className="animate-fade animate-delay-200 w-full bg-white flex self-end">
        <ChatBotForm onSubmit={handleSendMessage} />
      </div>
    </div>
  );
};
