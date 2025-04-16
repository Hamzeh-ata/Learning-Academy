import { FeatherIcon } from '@/app/shared/components';
import { useIsStudent } from '@/hooks';
import { chatRoomThunks, clientChatThunks } from '@/services/client-services/chat-room.service';
import { getImageFullPath } from '@utils/image-path';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { useDispatch } from 'react-redux';
import { useUserCurrentChatRoom } from '../../hooks/userCurrentChatRoom';
import { useTabs } from '../../hooks/useTabs';

export function ChatRoomUsers({ users }) {
  const isStudent = useIsStudent();
  const { selectedChatRoom } = useUserCurrentChatRoom();
  const { activeIndex } = useTabs();

  if (!users.length || !selectedChatRoom || activeIndex) {
    return null;
  }

  return (
    <div className="flex flex-col shadow-md rounded-2xl px-3 mt-2 py-4 gap-2">
      <h3 className="text-base font-semibold text-gray-800">Users</h3>
      <div className="flex flex-col justify-start items-start gap-2 max-h-[300px] overflow-y-auto">
        {users.map((user) => (
          <RoomUser
            key={user.userId}
            {...user}
            roomId={selectedChatRoom.roomId}
            isStudent={isStudent}
            status={user.isOnline ? 'Online' : 'Offline'}
          />
        ))}
      </div>
    </div>
  );
}

function RoomUser({ profileImage: image, userName, isOnline, isStudent, isMuted, userId, roomId }) {
  const dispatch = useDispatch();

  const statusClassNames = classNames({
    'text-green-400 fill-green-400 animate-pulse': isOnline,
    'text-gray-400 fill-gray-400': !isOnline
  });

  const handleToggleStudentMute = (mute) => {
    dispatch(chatRoomThunks.muteStudent({ isMuted: mute, studentUserId: userId, roomId }));
  };

  async function handleSendMessage() {
    await dispatch(
      clientChatThunks.sendMessage({ receiverID: userId, content: 'Hello There 👋', chatRoomId: 0 })
    ).unwrap();

    // navigate({
    //   pathname: '/messages',
    //   search: `?tab=Personal&userId=${userId}`,
    //   state: { key: new Date().getTime() }
    // });

    window.location.assign(`/messages?tab=Personal&userId=${userId}`);
  }

  return (
    <div className="flex items-center border-b border-blue-grey-400/20 w-full pb-2 last:border-none last:pb-0 justify-between flex-wrap">
      <div className="flex items-center gap-2">
        <img src={getImageFullPath(image)} alt={userName} className="w-10 h-10 rounded-1xl shadow-md p-0.5" />
        <div className="flex flex-col">
          <p className={`text-md font-semibold ${isMuted && 'line-through'}`}>{userName}</p>
          <p className={'text-sm text-gray-500 flex items-center gap-1'}>
            <span>
              <FeatherIcon name="Circle" size={10} className={statusClassNames} />
            </span>
            {isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        {!isStudent &&
          (!isMuted ? (
            <Button tooltip="Mute" tooltipOptions={{ position: 'left' }} onClick={() => handleToggleStudentMute(true)}>
              <FeatherIcon name="Mic" className="text-blue-600 hover:line-through" size={20} />
            </Button>
          ) : (
            <Button
              tooltip="Un Mute"
              tooltipOptions={{ position: 'left' }}
              onClick={() => handleToggleStudentMute(false)}
            >
              <FeatherIcon name="MicOff" className="text-red-600" size={20} />
            </Button>
          ))}
        <Button tooltip="Chat" tooltipOptions={{ position: 'left' }} onClick={handleSendMessage}>
          <FeatherIcon name="MessageSquare" className="text-arkan" size={20} />
        </Button>
      </div>
    </div>
  );
}
