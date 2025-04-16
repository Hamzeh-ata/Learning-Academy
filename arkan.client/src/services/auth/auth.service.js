import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@api/axios';
import { USER_TOKEN } from '@constants';

export const loginUser = createAsyncThunk('auth/login', async ({ email, password }, thunkAPI) => {
  try {
    const response = await axios.post('/auth/Login', { email, password });
    const data = response.data;
    localStorage.setItem(USER_TOKEN, JSON.stringify(data));
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const response = await axios.post('/auth/Register', userData);
    // Optionally, auto-login after registration
    localStorage.setItem(USER_TOKEN, JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    const response = await axios.put('/Logout');
    return response;
  } catch (error) {
    console.log(error);
  }
});

export const refreshToken = async () => {
  const response = await axios.get('/Auth/RefreshToken');
  const data = response.data;
  return data;
};
