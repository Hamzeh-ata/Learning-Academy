import { buildQueryString } from '@/api/query-builder';
import { constructFormData } from '@/api/utils';
import axios from '@api/axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const API_ENDPOINTS = {
  COURSE_CHAT_ROOM: '/CourseChatRoom',
  CLIENT_CHAT: '/ClientChat'
};

const clientThunks = (entity, endpoint) => ({
  getInstructorsList: createAsyncThunk(`${entity}/getInstructorList`, async () => {
    const response = await axios.get(`${endpoint}/StudentInstructors`);
    return response?.data;
  }),
  getRooms: createAsyncThunk(`${entity}/getRooms`, async () => {
    const response = await axios.get(`${endpoint}/Rooms`);
    return response?.data;
  }),
  deleteRoom: createAsyncThunk(`${entity}/deleteRoom`, async (id) => {
    await axios.delete(`${endpoint}/DeleteRoomChat${id}`);
    return id;
  }),
  addReaction: createAsyncThunk(`${entity}/addReaction`, async (data) => {
    const response = await axios.post(`${endpoint}/Reaction`, data);
    return response?.data;
  }),
  editReaction: createAsyncThunk(`${entity}/editReaction`, async (data) => {
    const response = await axios.put(`${endpoint}/Reaction`, data);
    return response?.data;
  }),
  deleteReaction: createAsyncThunk(`${entity}/deleteReaction`, async (id) => {
    const response = await axios.delete(`${endpoint}/Reaction/${id}`);
    return response?.data;
  }),
  sendMessage: createAsyncThunk(`${entity}/sendMessage`, async (data) => {
    const response = await axios.post(`${endpoint}/Message`, constructFormData(data));
    return response?.data;
  }),
  getRoomChat: createAsyncThunk(`${entity}/getRoomChat`, async (roomId) => {
    const url = `${endpoint}`;
    const response = await axios.get(`${url}/${roomId}`);
    return response?.data;
  }),
  deleteMessage: createAsyncThunk(`${entity}/deleteMessage`, async (id) => {
    await axios.delete(`${endpoint}/${id}`);
    return id;
  })
});

const createThunks = (entity, endpoint) => ({
  getUserRooms: createAsyncThunk(`${entity}/getUserRooms`, async () => {
    const response = await axios.get(`${endpoint}/GetUserRooms`);
    return response?.data;
  }),
  getRoomUsers: createAsyncThunk(`${entity}/getRoomUsers`, async (roomId) => {
    const response = await axios.get(`${endpoint}/GetRoomUsers${roomId}`);
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
      url = `${endpoint}/Mute`;
    } else {
      url = `${endpoint}/UnMute`;
    }
    const queryString = buildQueryString(req);
    const response = await axios.post(`${url}?${queryString}`);
    return response?.data;
  }),
  ...clientThunks(entity, endpoint)
});

const generateThunks = (sliceName, endpoints) =>
  Object.values(endpoints).map((endpoint) => createThunks(`${sliceName}/${endpoint}`, endpoint));

export const [chatRoomThunks, clientChatThunks] = generateThunks('', API_ENDPOINTS);
