import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@api/axios';

const API_PATH = '/Chapter';

export const fetchChapters = createAsyncThunk(
  'chapters/fetchChapters',
  async ({ currentPage = 1, pageSize = 10, courseId }) => {
    const response = await axios.get(`${API_PATH}?CourseId=${courseId}&pageNumber=${currentPage}&pageSize=${pageSize}`);
    return response.data || [];
  }
);

export const deleteChapter = createAsyncThunk('chapters/deleteChapter', async (chapter) => {
  await axios.delete(`${API_PATH}/${chapter.id}`);
  return chapter.id;
});

/**
 * @param chapter -- {
  courseId: number,
  name: string,
  description: string,
  isFree: boolean
}
 */
export const createChapter = createAsyncThunk('chapters/createChapter', async (chapter) => {
  const response = await axios.post(API_PATH, chapter);
  return response;
});

/**
 * @param chapter -- {
 * id:number,
 * chapterId: number,
 * name: string,
 * description: string,
 * isFree: boolean
}
 */
export const updateChapter = createAsyncThunk('chapters/updateChapter', async (chapter) => {
  const response = await axios.put(API_PATH, chapter);
  return response;
});
