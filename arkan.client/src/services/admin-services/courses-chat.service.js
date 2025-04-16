import { buildQueryString } from '@/api/query-builder';
import axios from '@api/axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const API_ENDPOINTS = {
  COURSE_CHAT_ROOM: '/CourseChatRoom'
};

const clientThunks = (entity, endpoint) => ({
  GetUserRooms: createAsyncThunk(`${entity}/GetAllRooms`, async () => {
    const response = await axios.get(`${endpoint}/GetAllRooms`);
    return response?.data;
  }),

  getRoomChat: createAsyncThunk(`${entity}/getRoomChat`, async (roomId) => {
    const url = `${endpoint}`;
    const response = await axios.get(`${url}/${roomId}`);
    return response?.data;
  })
});

const createThunks = (entity, endpoint) => ({
  getUserRooms: createAsyncThunk(`${entity}/GetAllRooms`, async () => {
    const response = await axios.get(`${endpoint}/GetAllRooms`);
    return response?.data;
  }),
  getRoomUsers: createAsyncThunk(`${entity}/GetAllRoomUsers`, async (roomId) => {
    const response = await axios.get(`${endpoint}/GetAllRoomUsers${roomId}`);
    return response?.data;
  }),
  getRoomAttachments: createAsyncThunk(`${entity}/getRoomAttachments`, async (roomId) => {
    const response = await axios.get(`${endpoint}/GetRoomAttachments${roomId}`);
    return response?.data;
  }),
  muteStudent: createAsyncThunk(`${entity}/muteStudent`, async (data) => {
    let url = endpoint;
    const { isMuted, ...req } = data;
    if (isMuted) {
      url = `${endpoint}/AdminMute`;
    } else {
      url = `${endpoint}/AdminUnMute`;
    }
    const queryString = buildQueryString(req);
    const response = await axios.post(`${url}?${queryString}`);
    return response?.data;
  }),

  ...clientThunks(entity, endpoint)
});

const generateThunks = (sliceName, endpoints) =>
  Object.values(endpoints).map((endpoint) => createThunks(`${sliceName}/${endpoint}`, endpoint));

export const [chatRoomThunks] = generateThunks('', API_ENDPOINTS);
