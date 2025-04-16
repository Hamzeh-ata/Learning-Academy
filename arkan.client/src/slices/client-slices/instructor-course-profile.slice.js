import { createSlice } from '@reduxjs/toolkit';
import { fetchCourseStudents } from '@services/client-services/instructor-course-profile.service';

const initialState = {
  students: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false
  }
};

const InstructorCourseProfileSlice = createSlice({
  name: 'instructorCourseProfile',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourseStudents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourseStudents.fulfilled, (state, action) => {
        const { currentPage, pageSize, totalCount, totalPages, hasNextPage, hasPreviousPage } = action.payload;

        state.pagination = {
          currentPage,
          pageSize,
          totalCount,
          totalPages,
          hasNextPage,
          hasPreviousPage
        };
        state.students = action.payload.items;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchCourseStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || action.payload;
      });
  }
});

export default InstructorCourseProfileSlice.reducer;

export const selectCourseStudents = (state) => state.instructorCourseProfile;
