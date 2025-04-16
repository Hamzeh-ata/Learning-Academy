import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@api/axios';

const API_PATH = '/ForgotPassword';

export const requestNewPassword = createAsyncThunk('requests/postRequest', async ({ password, email }, thunkAPI) => {
  try {
    const response = await axios.post(`${API_PATH}?email=${email}&newPassword=${password}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
