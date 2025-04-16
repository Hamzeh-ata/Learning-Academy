import { createSlice } from '@reduxjs/toolkit';
import { fetchNonEnrolledCourses } from '@/services/admin-services/user-services';

const initialState = {
  byUserId: {},
  loading: false,
  error: null,
  courses: [],
  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false
  }
};

const nonEnrolledSlice = createSlice({
  name: 'nonEnrolled',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNonEnrolledCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNonEnrolledCourses.fulfilled, (state, action) => {
        state.courses = action.payload.items;
        const { currentPage, pageSize, totalCount, totalPages, hasNextPage, hasPreviousPage } = action.payload;
        state.pagination = { currentPage, pageSize, totalCount, totalPages, hasNextPage, hasPreviousPage };
        state.loading = false;
      })
      .addCase(fetchNonEnrolledCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

// Selector to get loading state for non-enrolled courses
export const selectNonEnrolledLoading = (state) => state.nonEnrolled.loading;

export const selectNonEnrolledPagination = (state) => state.nonEnrolled.pagination;
// Selector to get non-enrolled courses
export const selectNonEnrolledCourses = (state) => state.nonEnrolled.courses;

export default nonEnrolledSlice.reducer;
