import { FeatherIcon } from '@/app/shared/components';
import { Button } from 'primereact/button';

export function ChatRoomInfoToggle({ setShowRoomInfo, showRoomInfo }) {
  return (
    <div className="w-12">
      <Button
        className="bg-slate-500/10 px-2 py-2 rounded-full text-slate-600 transition-all shadow hover:text-arkan hover:shadow-md"
        onClick={() => setShowRoomInfo(!showRoomInfo)}
      >
        <FeatherIcon name={!showRoomInfo ? 'MoreVertical' : 'X'} className="animate-delay-100 animate-flip-down" />
      </Button>
    </div>
  );
}
