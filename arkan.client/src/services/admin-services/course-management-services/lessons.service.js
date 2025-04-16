import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@api/axios';

const API_PATH = '/Lesson';

export const fetchLessons = createAsyncThunk('lessons/fetchLessons', async ({ chapterId }) => {
  const response = await axios.get(`${API_PATH}/${chapterId}`);
  return response.data || [];
});

export const deleteLesson = createAsyncThunk('lessons/deleteLesson', async (lesson) => {
  await axios.delete(`${API_PATH}/${lesson.id}`);
  return lesson.id;
});

/**
 * @param lesson -- {
  chapterId: number,
  name: string,
  description: string,
  isFree: boolean
}
 */
export const createLesson = createAsyncThunk('lessons/createLesson', async (lesson) => {
  const response = await axios.post(API_PATH, constructLessonForm(lesson));
  return response;
});

/**
 * @param lesson -- {
 * id:number,
 * lessonId: number,
 * name: string,
 * description: string,
 * isFree: boolean
}
 */
export const updateLesson = createAsyncThunk('lessons/updateLesson', async (lesson) => {
  const response = await axios.put(API_PATH, constructLessonForm(lesson));
  return response;
});

const constructLessonForm = (lesson) => {
  const formData = new FormData();

  formData.append('id', lesson.id);
  formData.append('chapterId', lesson.chapterId);
  formData.append('videoUrl', lesson.videoUrl);
  formData.append('description', lesson.description);
  formData.append('name', lesson.name);
  formData.append('material', lesson.material);
  formData.append('isFree', Boolean(lesson.isFree));

  return formData;
};
