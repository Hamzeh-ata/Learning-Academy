import axios from '@api/axios';
import { buildQueryString } from '@api/query-builder';
import { createAsyncThunk } from '@reduxjs/toolkit';

const API_PATH = '/InstructorPublicProfile';
const INSTRUCTORS_API_PATH = '/ClientInstructors';

export const getPublicProfile = createAsyncThunk('clientInstructors/getPublicProfile', async ({ instructorId }) => {
  const response = await axios.get(`${API_PATH}/${instructorId}`);
  return response.data || [];
});

export const getInstructorsByFilters = createAsyncThunk('clientInstructors/getClientInstructors', async (filters) => {
  const queryString = buildQueryString(filters);
  const url = `${INSTRUCTORS_API_PATH}?${queryString}`;
  const response = await axios.get(url);
  return response.data;
});
