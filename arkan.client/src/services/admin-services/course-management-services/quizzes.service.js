import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@api/axios';

const API_PATH = '/Quiz';

/**
 * @param Quiz -- {
  lessonId: number,
  title: string,
  description: string,
  timeLimit: number,
  isRequired: boolean,
  isRandomized: boolean,
  totalMarks: number,
  startDate: date,
  endDate: date
}
 */
export const createQuiz = createAsyncThunk('quizzes/createQuiz', async (quiz) => {
  const response = await axios.post(API_PATH, quiz);
  return response;
});

/**
 * @param Quiz -- {
  lessonId: number,
  title: string,
  description: string,
  timeLimit: number,
  isRequired: boolean,
  isRandomized: boolean,
  totalMarks: number,
  startDate: date,
  endDate: date
}
 */
export const updateQuiz = createAsyncThunk('quizzes/updateQuiz', async (quiz) => {
  const response = await axios.put(API_PATH, quiz);
  return response;
});

export const getQuizByLessonId = createAsyncThunk('quizzes/getQuizByLessonId', async (lessonId) => {
  const response = await axios.get(`${API_PATH}/${lessonId}`);
  return response;
});

export const getQuizIdByLessonId = createAsyncThunk('quizzes/getQuizIdByLessonId', async (lessonId) => {
  const response = await axios.get(`${API_PATH}/Id/${lessonId}`);
  return response;
});

export const deleteQuiz = createAsyncThunk('quizzes/deleteQuiz', async (quiz) => {
  await axios.delete(`${API_PATH}/${quiz.id}`);
  return quiz.id;
});
