import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import {
  createCourse,
  deleteCourse,
  updateCourse,
  fetchCourses,
  getCourseById
} from '@/services/admin-services/catalog-management-services/course.service';
import { COURSE_STATUSES } from '@constants';

const coursesAdapter = createEntityAdapter();

const initialState = coursesAdapter.getInitialState({
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
});
const CoursesSlice = createSlice({
  name: 'courses',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        coursesAdapter.setAll(state, action.payload.items);
        const { currentPage, pageSize, totalCount, totalPages, hasNextPage, hasPreviousPage } = action.payload;
        state.pagination = { currentPage, pageSize, totalCount, totalPages, hasNextPage, hasPreviousPage };

        state.loading = false;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })

      // create Course
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        coursesAdapter.addOne(state, action.payload.data);
        state.loading = false;
        state.error = null;
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // delete Course
      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        coursesAdapter.removeOne(state, action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // update Course
      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        if (action.payload.data.categories?.length) {
          action.payload.data.categoryIds = action.payload.data.categories.map((e) => e.id);
        }
        if (action.payload.data.universities?.length) {
          action.payload.data.universitiesIds = action.payload.data.universities.map((e) => e.id);
        }
        coursesAdapter.updateOne(state, { id: action.payload.data.id, changes: action.payload.data });
        state.loading = false;
        state.error = null;
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(getCourseById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCourseById.fulfilled, (state, action) => {
        action.payload.status = COURSE_STATUSES.find((e) => e.id === action.payload.status)?.name;
        coursesAdapter.upsertOne(state, action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(getCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});
export const selectLoading = (state) => state.courses.loading;
export const selectPaginationData = (state) => state.courses.pagination;
export const {
  selectAll: selectAllCourses
  // Add more selectors if needed
} = coursesAdapter.getSelectors((state) => state.courses);
export default CoursesSlice.reducer;
