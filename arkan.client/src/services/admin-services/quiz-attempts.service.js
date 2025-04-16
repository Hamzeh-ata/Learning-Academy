import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@api/axios';

const API_PATH = '/QuizStudentsAttempts';

export const getQuizStudentsAttempts = createAsyncThunk(
  'quizStudentsAttempts/getQuizStudentsAttempts',
  async (quizAttempt) => {
    const response = await axios.post(`${API_PATH}`, quizAttempt);
    return response.data || [];
  }
);
