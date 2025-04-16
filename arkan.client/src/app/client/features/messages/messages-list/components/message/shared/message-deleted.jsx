import { formatTimeStamp } from '@utils/date-format';
import { getImageFullPath } from '@utils/image-path';
import classNames from 'classnames';

export function MessageDeleted({ message }) {
  return (
    <div
      id={message.id}
      className={classNames('flex gap-2 justify-start p-2   animate-delay-300', {
        'animate-fade-left flex-row-reverse': message.type !== 'received',
        'animate-fade-right flex-row': message.type === 'received'
      })}
    >
      <div className="flex items-end">
        <img
          src={getImageFullPath(message.senderProfileImage)}
          alt={message.senderName}
          className="w-8 h-8 rounded-full p-0.5"
        />
      </div>
      <div className="text-sm bg-gray-300 p-2 px-4 rounded-2xl max-w-[250px] break-words text-red-900">
        Message Deleted
      </div>
      <span className="self-end flex gap-2 items-center">
        <span className="text-md text-gray-500 self-end">{formatTimeStamp(message.timestamp) || '12:00 AM'}</span>
      </span>
    </div>
  );
}
