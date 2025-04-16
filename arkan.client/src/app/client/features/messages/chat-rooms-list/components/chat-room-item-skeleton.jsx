import { Skeleton } from 'primereact/skeleton';

export function ChatRoomItemSkeleton() {
  return (
    <div className="flex items-center gap-4 justify-between p-2">
      <Skeleton width="4rem" height="4rem" className="w-16 h-16 rounded-full"></Skeleton>
      <div className="flex flex-col gap-2">
        <Skeleton width="4rem" height="1rem" className="w-16 h-16 rounded-full"></Skeleton>
        <Skeleton width="4rem" height="1rem" className="w-16 h-16 rounded-full"></Skeleton>
      </div>
      <Skeleton width="4rem" height="1rem" className="w-16 h-16 rounded-full"></Skeleton>
    </div>
  );
}
