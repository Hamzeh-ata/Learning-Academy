import { ImagePreview, ShowMore } from '@/app/shared/components';
import classNames from 'classnames';

export function MessageBody({ message, onScrollTo, getParentMessage, className }) {
  let parentMessage = null;

  if (message.parentMessageID) {
    parentMessage = getParentMessage(message.parentMessageID);
  }

  return (
    <div
      className={classNames(
        'text-base bg-white p-4 rounded-2xl max-w-[40%] break-words drop-shadow-md hover:drop-shadow-xl',
        className
      )}
    >
      {message.file && (
        <ImagePreview
          src={message.file}
          className="max-h-52 object-cover rounded-2xl shadow-sm animate-delay-200 animate-fade-down"
        />
      )}
      <ParentMessageContent onScrollTo={onScrollTo} message={message} parentMessage={parentMessage} />
      <span className="text-md font-semibold text-arkan mt-2">{message?.senderName}</span>

      <p className="break-all">
        <ShowMore>{message.content}</ShowMore>
      </p>
    </div>
  );
}

function ParentMessageContent({ message, onScrollTo, parentMessage }) {
  if (!message.parentMessageID || !parentMessage) {
    return null;
  }

  return (
    <div className="w-full flex cursor-pointer" onClick={() => onScrollTo(message.parentMessageID)}>
      <div className="flex flex-col gap-2 rounded-xl px-4 bg-slate-300 hover:bg-slate-400 py-4 flex-1">
        <span className="text-md font-semibold text-arkan">{parentMessage?.senderName}</span>
        <span className="text-md ">{parentMessage?.content}</span>
      </div>
    </div>
  );
}
