import { DyteMeeting } from '@dytesdk/react-ui-kit';
import { useDyteMeeting } from '@dytesdk/react-web-core';

export function MyMeeting() {
  const { meeting } = useDyteMeeting();

  return (
    <div className="h-[calc(100vh-250px)]">
      <DyteMeeting mode="fill" meeting={meeting} />
    </div>
  );
}
