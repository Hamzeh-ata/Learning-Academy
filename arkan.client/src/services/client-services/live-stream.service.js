import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@api/axios';
import { buildQueryString } from '@/api/query-builder';

const API_ENDPOINT = '/Live';

const createCrudThunks = (entity, endpoint) => ({
  get: createAsyncThunk(`${entity}/get`, async () => {
    const response = await axios.get(endpoint);
    return response?.data;
  }),
  getOne: createAsyncThunk(`${entity}/getOne`, async (id) => {
    const response = await axios.get(`${endpoint}/${id}`);
    return response?.data;
  }),
  delete: createAsyncThunk(`${entity}/delete`, async (id) => {
    await axios.delete(`${endpoint}/${id}`);
    return id;
  }),
  create: createAsyncThunk(`${entity}/create`, async (data) => {
    const response = await axios.post(endpoint, data);
    return response?.data;
  }),
  update: createAsyncThunk(`${entity}/update`, async (data) => {
    const response = await axios.put(`${endpoint}/${data.id}`, data);
    return response?.data;
  }),
  toggleLive: createAsyncThunk(`${entity}/toggleLive`, async (data) => {
    const queryString = buildQueryString(data);
    const url = `${endpoint}/toggleLive?${queryString}`;
    const response = await axios.post(url);
    return response?.data;
  })
});

export const liveStreamThunks = createCrudThunks(`${'LiveStream'}/${API_ENDPOINT}`, API_ENDPOINT);
