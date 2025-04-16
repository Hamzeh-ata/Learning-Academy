import { useEffect, useState } from 'react';
import { ChatRoomContent, ChatRoomsList, RoomInfo } from '@(client)/features/messages';
import { useDispatch } from 'react-redux';
import { toggleFooter } from '@/slices/client-slices/content-management.slice';

export default function MessagesPage() {
  const [showRoomInfo, setShowRoomInfo] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(toggleFooter(false));
    return () => {
      dispatch(toggleFooter(true));
    };
  }, []);

  return (
    <div className="flex overflow-x-hidden h-[calc(100vh-80px)] flex-wrap xl:flex-nowrap">
      <div className="bg-white w-full xl:w-1/4">
        <ChatRoomsList />
      </div>
      <div className="flex-1 grow">
        <ChatRoomContent setShowRoomInfo={setShowRoomInfo} showRoomInfo={showRoomInfo} />
      </div>
      {showRoomInfo && (
        <div className="bg-white w-1/5">
          <RoomInfo setShowRoomInfo={setShowRoomInfo} showRoomInfo={showRoomInfo} />
        </div>
      )}
    </div>
  );
}
