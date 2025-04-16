import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@api/axios';

const API_PATH = '/Answer';

export const getAnswerByQuestionId = createAsyncThunk('answers/getAnswerByQuestionId', async (questionId) => {
  const response = await axios.get(`${API_PATH}/${questionId}`);
  return response;
});

// eslint-disable-next-line no-unused-vars
export const deleteAnswer = createAsyncThunk('answers/deleteAnswer', async ({ answer, questionId }) => {
  await axios.delete(`${API_PATH}/${answer.id}`);
  return answer.id;
});

export const updateAnswer = createAsyncThunk('answers/updateAnswer', async ({ answer, questionId }) => {
  const response = await axios.put(API_PATH, constructAnswerForm(answer, questionId));
  return response;
});

export const createAnswer = createAsyncThunk('answers/createAnswer', async ({ answer, questionId }) => {
  const response = await axios.post(API_PATH, constructAnswerForm(answer, questionId));
  return response;
});

const constructAnswerForm = (answer, questionId) => {
  const formData = new FormData();
  if (questionId) {
    formData.append('questionId', questionId);
  }
  if (answer.id) {
    formData.append('id', answer.id);
  }
  formData.append('title', answer.title);
  formData.append('description', answer.description);
  formData.append('IsCorrect', Boolean(answer.isCorrect));
  formData.append('order', answer.order);
  formData.append('image', answer.image);

  return formData;
};
