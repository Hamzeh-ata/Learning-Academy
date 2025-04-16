import { createSlice } from '@reduxjs/toolkit';
import {
  getChapterStudents,
  hideChapterStudents,
  getChapterHiddenStudents,
  unHideChapterStudents
} from '@services/admin-services/students-chapters.service';

const initialState = {
  items: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false
  }
};

const StudentsChaptersSlice = createSlice({
  name: 'studentsChapters',
  initialState,
  reducers: {
    resetStudentsChaptersState: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChapterStudents.pending, (state) => {
        state.loading = true;
      })
      .addCase(getChapterStudents.fulfilled, (state, action) => {
        state.items = action.payload.items;
        const { currentPage, pageSize, totalCount, totalPages, hasNextPage, hasPreviousPage } = action.payload;
        state.pagination = { currentPage, pageSize, totalCount, totalPages, hasNextPage, hasPreviousPage };
        state.loading = false;
      })
      .addCase(getChapterStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(hideChapterStudents.pending, (state) => {
        state.loading = true;
      })
      .addCase(hideChapterStudents.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => !action.meta.arg.userIds.includes(item.userId));
        state.loading = false;
      })
      .addCase(hideChapterStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(getChapterHiddenStudents.pending, (state) => {
        state.loading = true;
      })
      .addCase(getChapterHiddenStudents.fulfilled, (state, action) => {
        state.items = action.payload.items;
        const { currentPage, pageSize, totalCount, totalPages, hasNextPage, hasPreviousPage } = action.payload;
        state.pagination = { currentPage, pageSize, totalCount, totalPages, hasNextPage, hasPreviousPage };
        state.loading = false;
      })
      .addCase(getChapterHiddenStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(unHideChapterStudents.pending, (state) => {
        state.loading = true;
      })
      .addCase(unHideChapterStudents.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => !action.meta.arg.userIds.includes(item.userId));
        state.loading = false;
      })
      .addCase(unHideChapterStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  }
});
export const selectLoading = (state) => state.studentsChapters.loading;
export const selectPagination = (state) => state.studentsChapters.pagination;
export const selectStudentsChapters = (state) => state.studentsChapters.items;
export const { resetStudentsChaptersState } = StudentsChaptersSlice.actions;

export default StudentsChaptersSlice.reducer;
