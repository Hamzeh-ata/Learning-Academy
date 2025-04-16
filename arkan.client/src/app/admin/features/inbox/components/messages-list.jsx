import { useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import { selectChatBotMessages } from '@/slices/shared/chatbot.slice';
import { formatTimeStamp } from '@utils/date-format';
import { getImageFullPath } from '@utils/image-path';
import classNames from 'classnames';
import { ImagePreview, ShowMore } from '@/app/shared/components';

export function MessagesList() {
  const { messages } = useSelector(selectChatBotMessages);
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
        <Message key={item.messageId} message={item} type={item.sentByClient ? 'received' : 'sent'} />
      ))}
    </div>
  );
}

export function Message({ message, type }) {
  const bodyClassName = type === 'received' ? 'rounded-bl-none' : 'rounded-br-none';

  const messageClassName = classNames('flex gap-2 justify-end p-2 animate-delay-300', {
    'flex-row-reverse animate-fade-left': type === 'received',
    'flex-row animate-fade-right': type === 'sent'
  });
  return (
    <div className={messageClassName} id={message.id}>
      <span className="self-end flex gap-2 items-center">
        <span className="text-md text-gray-400">{formatTimeStamp(message.timestamp)}</span>
      </span>

      <MessageBody message={message} className={bodyClassName} />

      <MessageUser message={message} />
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
          className="max-h-52 object-cover rounded-2xl shadow-sm animate-delay-200 animate-fade-down"
        />
      )}
      <p className="break-all">
        <ShowMore maxLength={100}>{message.content}</ShowMore>
      </p>
    </div>
  );
}

function MessageUser({ message }) {
  return (
    <div className="flex items-end">
      <img
        src={getImageFullPath(message.senderImage)}
        alt={message.senderName}
        className="w-8 h-8 rounded-full p-0.5 shadow-md"
      />
    </div>
  );
}
