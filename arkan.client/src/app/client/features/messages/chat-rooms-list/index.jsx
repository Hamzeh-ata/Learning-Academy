import { useChatRooms } from '../hooks/useChatRooms';
import { useClientChatRooms } from '../hooks/useClientChatRooms';
import { useTabs } from '../hooks/useTabs';
import { ChatRoomItem, ChatRoomItemSkeleton, ChatRoomSearch, ChatRoomTabs } from './components';

export function ChatRoomsList() {
  const tabs = [
    {
      label: 'Groups',
      disabled: false,
      command: (index) => {
        handleTabChange(index);
      }
    },
    {
      label: 'Personal',
      disabled: false,
      command: (index) => {
        handleTabChange(index);
      }
    }
  ];

  const { activeIndex, handleTabChange } = useTabs();
  const chatRoomLogic = useChatRooms(activeIndex, handleTabChange);
  const clientChatRoomLogic = useClientChatRooms(activeIndex, handleTabChange);

  const {
    chatRooms,
    filteredChatRooms: chatFilteredRooms,
    handleFilterChatRooms: handleFilterChatRooms1,
    activeChatRoom: chatActiveRoom,
    handleActiveChatRoom: handleActiveChatRoom1
  } = chatRoomLogic;

  const {
    clientChatRoom,
    filteredChatRooms: clientFilteredRooms,
    handleFilterChatRooms: handleFilterChatRooms2,
    activeChatRoom: clientActiveRoom,
    handleActiveChatRoom: handleActiveChatRoom2
  } = clientChatRoomLogic;

  const filteredChatRooms = activeIndex ? clientFilteredRooms : chatFilteredRooms;
  const handleFilterChatRooms = activeIndex ? handleFilterChatRooms2 : handleFilterChatRooms1;
  const activeChatRoom = activeIndex ? clientActiveRoom : chatActiveRoom;
  const handleActiveChatRoom = activeIndex ? handleActiveChatRoom2 : handleActiveChatRoom1;

  const isTabDisabled = (index) => {
    if (index === 1) {
      return !clientChatRoom.rooms.length;
    }
  };

  return (
    <div className="overflow-y-auto bg-white p-4 pt-8 h-full max-h-[calc(100vh-80px)] flex flex-col gap-2 border-r border-blue-grey-50">
      <ChatRoomSearch onSearch={handleFilterChatRooms} />
      <ChatRoomTabs activeIndex={activeIndex} tabs={tabs} isTabDisabled={isTabDisabled} />
      {activeIndex ? (
        <>
          {clientChatRoom.loading &&
            new Array(5).fill(5).map((_, index) => (
              <div className="flex flex-col gap-2 border-b border-blue-grey-300/60" key={index + 2}>
                <ChatRoomItemSkeleton />
              </div>
            ))}
          {!clientChatRoom.loading &&
            filteredChatRooms?.map((item) => (
              <div className="flex flex-col gap-2 border-b border-blue-grey-300/60" key={item.roomId}>
                <ChatRoomItem room={item} activeRoomId={activeChatRoom?.roomId} onClick={handleActiveChatRoom} />
              </div>
            ))}
        </>
      ) : (
        <>
          {chatRooms.loading &&
            new Array(5).fill(5).map((_, index) => (
              <div className="flex flex-col gap-2 border-b border-blue-grey-300/60" key={index + 2}>
                <ChatRoomItemSkeleton />
              </div>
            ))}
          {!chatRooms.loading &&
            filteredChatRooms?.map((item) => (
              <div className="flex flex-col gap-2 border-b border-blue-grey-300/60" key={item.roomId}>
                <ChatRoomItem room={item} activeRoomId={activeChatRoom?.roomId} onClick={handleActiveChatRoom} />
              </div>
            ))}
        </>
      )}
    </div>
  );
}
