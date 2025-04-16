import { createSlice } from '@reduxjs/toolkit';
import { fetchStudentCourses } from '@/services/admin-services/user-services';

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

const studentCoursesSlice = createSlice({
  name: 'studentCourses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //get student courses
      .addCase(fetchStudentCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudentCourses.fulfilled, (state, action) => {
        state.courses = action.payload.items;
        const { currentPage, pageSize, totalCount, totalPages, hasNextPage, hasPreviousPage } = action.payload;
        state.pagination = { currentPage, pageSize, totalCount, totalPages, hasNextPage, hasPreviousPage };
        state.loading = false;
      })

      .addCase(fetchStudentCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  }
});

export const selectStudentCoursesLoading = (state) => state.studentCourses.loading;
export const selectStudentCoursesPagination = (state) => state.studentCourses.pagination;

export const selectAllStudentCourses = (state) => state.studentCourses.courses;

export default studentCoursesSlice.reducer;
