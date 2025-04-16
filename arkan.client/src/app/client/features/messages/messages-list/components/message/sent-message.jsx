import { MessageBody, MessageUser, DeleteMessage, ReactionsDisplay } from './shared';
import { getDateAgo } from '@utils/date-format';

export function SentMessage({ message, getParentMessage, onScrollTo }) {
  return (
    <div className="flex gap-2 justify-end p-2 animate-fade-left animate-delay-300" id={message.id}>
      <span className="self-end flex gap-2 items-center">
        <DeleteMessage message={message} />
        <span className="text-md text-gray-500">{getDateAgo(message.timestamp)}</span>
      </span>

      <ReactionsDisplay reactions={message.reactions} messageId={message.id} />

      <MessageBody
        message={message}
        onScrollTo={onScrollTo}
        getParentMessage={getParentMessage}
        className={'rounded-br-none'}
      />

      <MessageUser message={message} />
    </div>
  );
}
