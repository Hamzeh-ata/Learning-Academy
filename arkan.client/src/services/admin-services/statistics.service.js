import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@api/axios';

const BASE_URL = '/AdminStatistics';

const API_ENDPOINTS = {
  STATISTICS: BASE_URL,
  COURSES: `${BASE_URL}/CourseStatistics`,
  INSTRUCTORS: `${BASE_URL}/InstructorStatistics`,
  STUDENTS: `${BASE_URL}/StudentStatistics`,
  ORDERS: `${BASE_URL}/OrdersStatistics`
};

const SLICE_NAME = 'adminStatistics';

const createCRUDThunks = (entity, endpoint) => ({
  get: createAsyncThunk(`${entity}/get`, async () => {
    const response = await axios.get(endpoint);
    return response?.data;
  }),

  getById: createAsyncThunk(`${entity}/getById`, async ({ key, id }) => {
    const response = await axios.get(`${endpoint}?${key}=${id}`);
    return response?.data;
  }),

  getByDateRange: createAsyncThunk(`${entity}/getByDateRange`, async ({ startDate, endDate }) => {
    const response = await axios.get(`${endpoint}?FromDate=${startDate}&ToDate=${endDate}`);
    return response?.data;
  })
});

const createThunks = (sliceName, endpoints) =>
  Object.values(endpoints).map((endpoint) => createCRUDThunks(`${sliceName}/${endpoint}`, endpoint));

export const [
  statisticsThunks,
  courseStatisticsThunks,
  instructorStatisticsThunks,
  studentStatisticsThunks,
  ordersStatisticsThunks
] = createThunks(SLICE_NAME, API_ENDPOINTS);
