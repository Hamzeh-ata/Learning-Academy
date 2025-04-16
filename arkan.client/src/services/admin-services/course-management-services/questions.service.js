import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@api/axios';

const API_PATH = '/Question';

export const getQuestionsByQuizId = createAsyncThunk('questions/getQuestionsByQuizId', async (quizId) => {
  const response = await axios.get(`${API_PATH}/${quizId}`);
  return response;
});

export const deleteQuestion = createAsyncThunk('questions/deleteQuestion', async (question) => {
  await axios.delete(`${API_PATH}/${question.id}`);
  return question.id;
});

export const updateQuestion = createAsyncThunk('questions/updateQuiz', async (question) => {
  const response = await axios.put(API_PATH, constructQuestionForm(question));
  return response;
});

export const createQuestion = createAsyncThunk('questions/createQuestion', async ({ question, quizId }) => {
  const response = await axios.post(API_PATH, constructQuestionForm(question, quizId));
  return response;
});

const constructQuestionForm = (question, quizId) => {
  const formData = new FormData();
  if (quizId) {
    formData.append('quizId', quizId);
  }
  if (question.id) {
    formData.append('id', question.id);
  }
  formData.append('title', question.title);
  formData.append('description', question.description);
  formData.append('points', question.points);
  formData.append('order', question.order);
  formData.append('image', question.image);

  return formData;
};
