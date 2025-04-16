import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@api/axios';

const API_PATH = '/Logger';

export const fetchActivitesLog = createAsyncThunk(
  'Logger/getActivitesLog',
  async ({ currentPage = 1, pageSize = 10 }) => {
    const response = await axios.get(`${API_PATH}?&pageNumber=${currentPage}&pageSize=${pageSize}`);
    return response.data || [];
  }
);
