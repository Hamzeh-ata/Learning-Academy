import { FeatherIcon } from '@/app/shared/components';
import { getImageFullPath } from '@utils/image-path';
import classNames from 'classnames';

export function ChatRoomHeader({ image, name, status }) {
  const isOnline = status === 'Online';

  const statusClassNames = classNames({
    'text-green-400 fill-green-400 animate-pulse': isOnline,
    'text-gray-400 fill-gray-400': !isOnline
  });
  return (
    <div className="flex items-center gap-2 p-4 flex-1">
      <img src={getImageFullPath(image)} alt={name} className="w-12 h-12 rounded-full p-0.5" />
      <div className="flex flex-col">
        <p className="text-base font-semibold">{name}</p>
        <p className={'text-md text-gray-500 flex items-center gap-1'}>
          <span>
            <FeatherIcon name="Circle" size={12} className={statusClassNames} />
          </span>
          {status}
        </p>
      </div>
    </div>
  );
}
