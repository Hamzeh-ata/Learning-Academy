import axios from 'axios';
import { getCreateMeetingOptions, getJoinMeetingOptions, stopLiveStream } from './utils';

export const DYTE_CLIENT = {
  createMeeting: async (meetingName) => {
    try {
      const { data } = await axios.request(getCreateMeetingOptions(meetingName));
      return data;
    } catch (error) {
      console.error(error);
    }
  },
  joinMeeting: async (options) => {
    try {
      const { data } = await axios.request(getJoinMeetingOptions(options));
      return data;
    } catch (error) {
      console.error(error);
    }
  },
  stopMeeting: async (options) => {
    try {
      const { data } = await axios.request(stopLiveStream(options));
      return data;
    } catch (error) {
      console.error(error);
    }
  }
};
