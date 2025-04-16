import { useEffect } from 'react';
import { useDyteClient, DyteProvider } from '@dytesdk/react-web-core';
import { MyMeeting } from '../myMeeting';
import { useParams } from 'react-router-dom';

export default function Meeting() {
  const [meeting, initMeeting] = useDyteClient();
  const { meetingId } = useParams();

  useEffect(() => {
    if (!meetingId) return;
    initMeeting({
      authToken: meetingId,
      defaults: {
        audio: false,
        video: false
      }
    });
  }, [meetingId]);

  useEffect(() => {
    if (!meeting) return;

    const handleHostLeave = () => {
      console.log('Host has left the meeting.');
    };

    const handleMeetingEnd = () => {
      console.log('Meeting has ended.');
    };

    meeting.connectedMeetings.on('meetingEnded', handleMeetingEnd);
    meeting.connectedMeetings.on('hostLeft', handleHostLeave);
    meeting.self.on('roomLeft', handleHostLeave);

    return () => {
      meeting.connectedMeetings.off('meetingEnded', handleMeetingEnd);
      meeting.connectedMeetings.off('hostLeft', handleHostLeave);
      meeting.self.off('roomLeft', handleHostLeave);
    };
  }, [meeting]);

  return (
    <DyteProvider value={meeting} fallback={<i>Loading...</i>}>
      <MyMeeting />
    </DyteProvider>
  );
}
