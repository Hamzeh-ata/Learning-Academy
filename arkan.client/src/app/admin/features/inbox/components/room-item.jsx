import { formatTimeStamp } from '@utils/date-format';
import { getImageFullPath } from '@utils/image-path';
import classNames from 'classnames';

export function RoomItem({ room, onClick, activeRoomId }) {
  return (
    <div
      className={classNames(
        'flex items-start gap-4 rounded-2xl p-3 hover:bg-blue-grey-300 hover:text-slate-600 cursor-pointer transition-colors text-slate-300 mb-1 justify-between flex-wrap',
        {
          'bg-blue-grey-300 text-slate-600': activeRoomId === room.roomId
        }
      )}
      onClick={() => {
        onClick(room);
      }}
    >
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <img
          src={getImageFullPath(room.senderImage)}
          alt={room.senderName}
          className="w-14 h-14 rounded-full p-0.5 drop-shadow-md"
        />
        <div className="flex flex-col">
          <p className="text-base font-semibold break-words break-all truncate max-w-[140px]">{room.senderName}</p>
          <p className="text-md text-gray-500 break-words break-all truncate max-w-[140px]">
            {room.lastMessage || '...'}
          </p>
        </div>
      </div>

      <p className="text-md text-gray-500">{formatTimeStamp(room.lastMessageTimestamp) || '12:00 AM'}</p>
    </div>
  );
}
