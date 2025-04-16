import axios from '@api/axios';
import { createCRUDThunks } from '@api/utils';
import { createAsyncThunk } from '@reduxjs/toolkit';

const API_ENDPOINTS = {
  chapters: '/InstructorChapters',
  lessons: '/InstructorLessons',
  quizzes: '/InstructorQuiz',
  questions: '/InstructorQuestions',
  answers: '/InstructorAnswers'
};

export const chaptersThunks = createCRUDThunks('chapters', API_ENDPOINTS.chapters);
export const lessonsThunks = createCRUDThunks('lessons', API_ENDPOINTS.lessons, true);
export const quizzesThunks = createCRUDThunks('quizzes', API_ENDPOINTS.quizzes);
export const questionsThunks = createCRUDThunks('questions', API_ENDPOINTS.questions, true);
export const answersThunks = createCRUDThunks('answers', API_ENDPOINTS.answers, true);

export const fetchCourseChapters = createAsyncThunk('instructor/fetchCourseChapters', async (courseId) => {
  const response = await axios.get(`/ClientChapters/${courseId}`);
  return response?.data;
});

export const fetchCourseStudents = createAsyncThunk('instructor/courseStudents', async (params) => {
  const response = await axios.post('ClientCourseStudents', params);
  return response?.data;
});
