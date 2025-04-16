import axios from '@api/axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const API_PATH = '/Pages';

export const fetchPages = createAsyncThunk('permissions/fetchPages', async (_, thunkAPI) => {
  try {
    const response = await axios.get(API_PATH);
    return response?.data || [];
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const addPage = createAsyncThunk('permissions/addPage', async (pageData, thunkAPI) => {
  try {
    const response = await axios.post(API_PATH, pageData);
    return response?.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
