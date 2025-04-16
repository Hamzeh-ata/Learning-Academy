import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@api/axios';

const API_PATH = '/StudentChaptersManage';

export const getChapterStudents = createAsyncThunk(
  'studentChaptersManage/getChapterStudents',
  async ({ chapterId, courseId, pageNumber, pageSize }) => {
    const response = await axios.get(
      `${API_PATH}/ChapterStudents?chapterId=${chapterId}&courseId=${courseId}&pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data || [];
  }
);

export const hideChapterStudents = createAsyncThunk(
  'studentsChapters/hideChapterStudents',
  async ({ chapterId, courseId, userIds }) => {
    const response = await axios.post(`${API_PATH}/Hide`, {
      chapterId,
      courseId,
      userIds
    });
    return response.data;
  }
);

export const getChapterHiddenStudents = createAsyncThunk(
  'studentChaptersManage/getChapterHiddenStudents',
  async ({ chapterId, courseId, pageNumber, pageSize }) => {
    const response = await axios.get(
      `${API_PATH}/NoneChapterStudents?chapterId=${chapterId}&courseId=${courseId}&pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data || [];
  }
);
export const unHideChapterStudents = createAsyncThunk(
  'studentsChapters/unHideChapterStudents',
  async ({ chapterId, courseId, userIds }) => {
    const response = await axios.post(`${API_PATH}/UnHide`, {
      chapterId,
      courseId,
      userIds
    });
    return response.data;
  }
);
