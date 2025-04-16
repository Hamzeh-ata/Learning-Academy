import { createSlice } from '@reduxjs/toolkit';
import { fetchCategoryCourses } from '@/services/admin-services/catalog-management-services/category.service';

const initialState = {
  byCategoryId: {},
  loading: false,
  error: null
};

const categoryCoursesSlice = createSlice({
  name: 'categoryCourses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoryCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategoryCourses.fulfilled, (state, action) => {
        const { categoryId, courses } = action.payload;
        state.byCategoryId[categoryId] = courses;
        state.loading = false;
      })
      .addCase(fetchCategoryCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

// Selector to get loading state for courses
export const selectCoursesLoading = (state) => state.categoryCourses.loading;

export const selectCoursesByCategoryId = (state, categoryId) => state.categoryCourses.byCategoryId[categoryId] || [];

export default categoryCoursesSlice.reducer;
