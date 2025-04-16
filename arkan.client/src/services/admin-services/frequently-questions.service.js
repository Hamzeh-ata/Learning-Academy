import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@api/axios';

const API_PATH = '/FrequentlyQuestions';

export const addQuestion = createAsyncThunk('FrequentlyQuestions/addQuestion', async ({ data }) => {
  const response = await axios.post(API_PATH, data);
  return response.data;
});

export const updateQuestion = createAsyncThunk('FrequentlyQuestions/updateQuestion', async ({ data }) => {
  const response = await axios.put(API_PATH, data);
  return response.data;
});

export const deleteQuestion = createAsyncThunk('FrequentlyQuestions/deleteQuestion', async (data) => {
  await axios.delete(`${API_PATH}/${data.id}`);
  return data.id;
});

export const getAllQuestions = createAsyncThunk('FrequentlyQuestions/getAllQuestions', async () => {
  const response = await axios.get(`${API_PATH}`);
  return response.data;
});

export const getQuestionById = createAsyncThunk('FrequentlyQuestions/getQuestionById', async (id) => {
  const response = await axios.get(`${API_PATH}/${id}`);
  return response.data;
});
