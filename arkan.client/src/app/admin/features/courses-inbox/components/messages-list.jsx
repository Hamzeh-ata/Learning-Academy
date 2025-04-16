import { useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import { selectChatRoomMessages } from '@/slices/admin-slices/courses-chat.slice';
import classNames from 'classnames';
import { ImagePreview, ShowMore } from '@/app/shared/components';
export function MessagesList() {
  const { messages } = useSelector(selectChatRoomMessages);
  const messageContainerRef = useRef(null);

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

  return (
    <div
      className="flex flex-col gap-2 overflow-y-auto h-[calc(100vh-420px)] px-4 overflow-x-hidden border-slate-950 bg-slate-700 py-2"
      ref={messageContainerRef}
    >
      {messages.map((item) => (
        <Message key={item.messageId} message={item} />
      ))}
    </div>
  );
}

export function Message({ message }) {
  const messageClassName = classNames('flex flex-col gap-2 p-2 animate-delay-300 animate-fade-left');

  return (
    <div className={messageClassName} id={message.id}>
      <MessageUserName message={message} />
      <MessageBody message={message} />
    </div>
  );
}

function MessageBody({ message, className }) {
  return (
    <div
      className={classNames(
        'text-base text-gray-200 bg-slate-800 p-4 rounded-2xl max-w-[40%] break-words drop-shadow-md',
        className
      )}
    >
      {message.file && (
        <ImagePreview
          src={message.file}
          className="max-h-52 object-cover rounded-2xl shadow-sm animate-delay-200 animate-fade-down w-full"
        />
      )}
      <p className="break-all">
        <ShowMore maxLength={100}>{message.content}</ShowMore>
      </p>
    </div>
  );
}

function MessageUserName({ message }) {
  return (
    <div className="flex flex items-start mb-2">
      <span className="text-xs text-gray-400 mt-1 ml-1">{message.senderName}</span>
    </div>
  );
}
