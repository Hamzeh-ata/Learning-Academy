import { formatTimeStamp } from '@utils/date-format';
import { getImageFullPath } from '@utils/image-path';
import classNames from 'classnames';
import { useSearchParams } from 'react-router-dom';

export function ChatRoomItem({ room, onClick, activeRoomId }) {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div
      className={classNames(
        'flex items-start gap-4 rounded-2xl p-3 hover:bg-blue-grey-300 cursor-pointer transition-colors  mb-1 justify-between flex-wrap',
        {
          'bg-blue-grey-300': activeRoomId === room.roomId
        }
      )}
      onClick={() => {
        const tab = searchParams.get('tab');
        setSearchParams({ tab, chatRoom: room.roomId });
        onClick(room);
      }}
    >
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <img
          src={getImageFullPath(room.courseImage)}
          alt={room.courseName}
          className="w-14 h-14 rounded-full p-0.5 drop-shadow-md"
        />
        <div className="flex flex-col">
          <p className="text-base font-semibold break-words break-all truncate max-w-[230px]">{room.courseName}</p>
          <p className="text-md text-gray-400 break-words break-all truncate max-w-[220px]">
            {room.lastMessageContent || '...'}
          </p>
        </div>
      </div>

      <p className="text-md text-gray-500">{formatTimeStamp(room.lastMessageTimestamp) || '12:00 AM'}</p>
    </div>
  );
}
