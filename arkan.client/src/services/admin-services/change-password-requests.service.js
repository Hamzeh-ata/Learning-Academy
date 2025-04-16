import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@api/axios';

const API_PATH = '/ForgotPassword';

export const fetchRequests = createAsyncThunk('requests/fetchRequests', async () => {
  const response = await axios.get(API_PATH);
  return response.data || [];
});

export const deleteRequest = createAsyncThunk('requests/deleteRequest', async (request) => {
  await axios.delete(`${API_PATH}/${request.id}`);
  return request.id;
});

export const acceptRequest = createAsyncThunk('requests/acceptRequest', async (request) => {
  await axios.post(`${API_PATH}/${request.id}`);
  return request.id;
});
