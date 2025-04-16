import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@api/axios';

const API_PATH = '/ClientCourses';
const CHAPTERS_API_PATH = '/ClientChapters';

export const fetchCourseById = createAsyncThunk('courseProfile/fetchCourseById', async (courseId) => {
  const response = await axios.get(`${API_PATH}/${courseId}`);
  return response?.data;
});

export const fetchCourseChapters = createAsyncThunk('courseProfile/fetchCourseChapters', async (courseId) => {
  const response = await axios.get(`${CHAPTERS_API_PATH}/${courseId}`);
  return response?.data;
});

export const completeLesson = createAsyncThunk('courseProfile/completeLesson', async (lessonId) => {
  try {
    await axios.post(`/CompleteLesson/${lessonId}`);
    return lessonId;
  } catch (err) {
    console.log(err);
    return err || 'failed to update course';
  }
});
