import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@api/axios';

const API_PATH = '/University';

export const fetchUniversities = createAsyncThunk(
  'universities/fetchUniversities',
  async ({ currentPage = 1, pageSize = 10 }) => {
    const response = await axios.get(`${API_PATH}?pageNumber=${currentPage}&pageSize=${pageSize}`);
    return response.data || [];
  }
);

export const getUniversityById = createAsyncThunk('universities/getUniversityById', async (universityId, thunkAPI) => {
  try {
    const response = await axios.get(`${API_PATH}/${universityId}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

/**
* @param university -- {
  "id": number,
  "name": "string",
  "shortName": "string",
  "image": "string"
}
 */
export const updateUniversity = createAsyncThunk('universities/updateUniversity', async (university) => {
  const response = await axios.put(`${API_PATH}`, constructUniversityForm(university));
  return response;
});

export const createUniversity = createAsyncThunk('universities/createUniversity', async (university) => {
  const response = await axios.post(API_PATH, constructUniversityForm(university));
  return response.data;
});

export const deleteUniversity = createAsyncThunk('universities/deleteUniversity', async (university) => {
  await axios.delete(`${API_PATH}/${university.id}`);
  return university.id;
});

const constructUniversityForm = (university) => {
  const formData = new FormData();
  if (university.id) {
    formData.append('id', university.id);
  }
  formData.append('name', university.name);
  formData.append('shortName', university.shortName);
  formData.append('Image', university.image);
  return formData;
};
