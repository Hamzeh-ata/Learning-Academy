import { RoomMessages, RoomsList } from './components';

export function CoursesMessages() {
  return (
    <div className="flex overflow-x-hidden h-[calc(100vh-380px)]">
      <div className="bg-slate-900 w-1/4 overflow-hidden rounded-xl">
        <RoomsList />
      </div>
      <div className="flex-1 grow">
        <RoomMessages />
      </div>
    </div>
  );
}
