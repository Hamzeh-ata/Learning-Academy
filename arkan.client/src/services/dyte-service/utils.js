const token = btoa(import.meta.env.VITE_DYTE_ORG_ID + ':' + import.meta.env.VITE_DYTE_API_KEY);
const requestHeader = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  Authorization: `Basic ${token}`
};

export const getCreateMeetingOptions = (title) => ({
  method: 'POST',
  url: 'https://api.dyte.io/v2/meetings',
  headers: requestHeader,
  data: {
    title: title,
    preferred_region: 'ap-south-1',
    record_on_start: false,
    live_stream_on_start: true,
    recording_config: {
      max_seconds: 60,
      file_name_prefix: title,
      video_config: {
        codec: 'H264',
        width: 1280,
        height: 720,
        watermark: { url: 'http://arkan.com', size: { width: 1, height: 1 }, position: 'left top' },
        export_file: true
      },
      audio_config: { codec: 'AAC', channel: 'stereo', export_file: true },

      dyte_bucket_config: { enabled: false },
      live_streaming_config: { rtmp_url: 'rtmp://a.rtmp.youtube.com/live2' }
    },
    persist_chat: false,
    summarize_on_end: false
  }
});

export const getJoinMeetingOptions = ({ meetingId, participantName, participantImage, participantId, isHost }) => ({
  method: 'POST',
  url: `https://api.dyte.io/v2/meetings/${meetingId}/participants`,
  headers: requestHeader,
  data: {
    name: participantName,
    picture: participantImage,
    preset_name: isHost ? 'livestream_host' : 'livestream_viewer',
    custom_participant_id: participantId
  }
});

export const stopLiveStream = ({ meetingId }) => ({
  method: 'POST',
  url: `https://api.dyte.io/v2/meetings/${meetingId}/active-livestream/stop `,
  headers: requestHeader
});
