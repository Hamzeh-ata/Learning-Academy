import { createSlice } from '@reduxjs/toolkit';
import { getCourseByFilters } from '@services/client-services/courses-filter.service';

const initialState = {
  courses: [],
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

const coursesFilterSlice = createSlice({
  name: 'coursesFilter',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getCourseByFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCourseByFilters.fulfilled, (state, action) => {
        state.courses = action.payload.items;
        const { currentPage, pageSize, totalCount, totalPages, hasNextPage, hasPreviousPage } = action.payload;
        state.pagination = { currentPage, pageSize, totalCount, totalPages, hasNextPage, hasPreviousPage };

        state.loading = false;
      })
      .addCase(getCourseByFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch courses';
      });
  }
});

export const selectPaginationData = (state) => state.coursesFilter.pagination;
export const selectFilteredCourses = (state) => state.coursesFilter.courses;
export const selectLoader = (state) => state.coursesFilter.loading;

export default coursesFilterSlice.reducer;
