import { useSelector } from 'react-redux';
import emptyChat from '@assets/images/empty-chat.svg';
import { useEffect, useRef } from 'react';
import { selectUserProfile } from '@/slices/client-slices/user-profile.slice';
import { Message } from './components/message';
import { useChatRoomMessages } from '../hooks/useChatRoomMessages';

export function MessagesList({ setParentMessage }) {
  const { messages } = useChatRoomMessages();
  const userProfile = useSelector(selectUserProfile);
  const messageContainerRef = useRef(null);

  useEffect(() => {
    if (messages.length) {
      setTimeout(() => scrollToBottom(), 200);
    }
  }, [messages]);

  if (!messages.length) {
    return (
      <div className="flex flex-col justify-center items-center">
        <img src={emptyChat} alt="empty chat" className="h-[calc(100vh-340px)]" />
        <p className="text-gray-600 mb-2">Say Hi 👋</p>
      </div>
    );
  }

  function scrollToBottom() {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo(0, messageContainerRef.current.scrollHeight);
    }
  }

  function handleOnReply(message) {
    setParentMessage(message);
  }

  return (
    <div
      className="flex flex-col gap-2 overflow-y-auto h-[calc(100vh-200px)] px-4 overflow-x-hidden mx-6 xl:mx-0"
      ref={messageContainerRef}
    >
      {messages.map((item) => (
        <Message
          key={item.id}
          message={item}
          getParentMessage={(id) => getParentMessage(id, messages)}
          onReply={handleOnReply}
          onScrollTo={(id) => onScrollTo(id, messageContainerRef)}
          type={item.senderId === userProfile.userId ? 'sent' : 'received'}
        />
      ))}
    </div>
  );
}

function getParentMessage(id, messages) {
  const message = messages.find((item) => item.id === id);
  if (message) {
    return message;
  }
  return null;
}

function onScrollTo(id, messageContainerRef) {
  const element = document.getElementById(id);
  if (element) {
    element.classList.add('shake-element');
    messageContainerRef?.current?.scrollTo(0, element.offsetTop - 300);
  }
}
