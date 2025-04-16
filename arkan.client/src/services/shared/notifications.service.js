import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@api/axios';

const BASE_URL = '/UserNotifications';

const API_ENDPOINTS = {
  Notifications: BASE_URL,
  DeleteNotifications: `${BASE_URL}/Delete`
};

const createCrudThunks = (entity, endpoint) => ({
  get: createAsyncThunk(`${entity}/get`, async () => {
    const response = await axios.get(endpoint);
    return response?.data;
  }),
  delete: createAsyncThunk(`${entity}/delete`, async (notifications) => {
    await axios.post(endpoint, notifications);
    return notifications;
  })
});

const createThunks = (sliceName, endpoints) =>
  Object.values(endpoints).map((endpoint) => createCrudThunks(`${sliceName}/${endpoint}`, endpoint));

export const [notificationsThunks, deleteNotificationsThunks] = createThunks('notifications', API_ENDPOINTS);
