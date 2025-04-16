import { constructFormData } from '@/api/utils';
import axios from '@api/axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const API_ENDPOINT = '/SupportChat';

const thunks = (entity, endpoint) => ({
  getRooms: createAsyncThunk(`${entity}/getRooms`, async () => {
    const response = await axios.get(`${endpoint}/Rooms`);
    return response?.data;
  }),

  sendMessage: createAsyncThunk(`${entity}/sendMessage`, async (data) => {
    const response = await axios.post(`${endpoint}/Message`, constructFormData(data));
    return response?.data;
  }),
  getRoomId: createAsyncThunk(`${entity}/getRoomId`, async () => {
    const response = await axios.get(`${endpoint}/UserRoom`);
    return response?.data;
  }),
  deleteChatRoom: createAsyncThunk(`${entity}/deleteMessage`, async (id) => {
    await axios.delete(`${endpoint}/${id}`);
    return id;
  }),
  getRoomMessages: createAsyncThunk(`${entity}/getChatRoomMessages`, async (roomId) => {
    const response = await axios.get(`${endpoint}/${roomId}`);
    return response?.data;
  })
});

export const ChatBotThunks = thunks('chatBot', API_ENDPOINT);
