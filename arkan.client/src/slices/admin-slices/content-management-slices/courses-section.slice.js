import { coursesSectionThunks } from '@/services/admin-services/admin-content-management.service';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {
    courses: [],
    loading: false,
    error: null
  }
};

const coursesSectionSlice = createSlice({
  name: 'adminContentManagement/coursesSection',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(coursesSectionThunks.get.pending, (state) => {
        state.data.loading = true;
      })
      .addCase(coursesSectionThunks.get.fulfilled, (state, action) => {
        state.data.courses = action.payload;
        state.data.loading = false;
        state.data.error = null;
      })
      .addCase(coursesSectionThunks.get.rejected, (state, action) => {
        state.data.loading = false;
        state.data.error = action.error.message;
      })

      .addCase(coursesSectionThunks.create.pending, (state) => {
        state.data.loading = true;
      })
      .addCase(coursesSectionThunks.create.fulfilled, (state, action) => {
        state.data.courses.push(action.payload);
        state.data.loading = false;
        state.data.error = null;
      })
      .addCase(coursesSectionThunks.create.rejected, (state, action) => {
        state.data.loading = false;
        state.data.error = action.error.message;
      })

      .addCase(coursesSectionThunks.delete.pending, (state) => {
        state.data.loading = true;
      })
      .addCase(coursesSectionThunks.delete.fulfilled, (state, action) => {
        state.data.courses = state.data.courses.filter((course) => course.id !== action.payload);
        state.data.loading = false;
      })
      .addCase(coursesSectionThunks.delete.rejected, (state, action) => {
        state.data.loading = false;
        state.data.error = action.error.message;
      });
  }
});

export const selectCoursesSection = (state) => state.adminContentManagement.coursesSection.data;

export default coursesSectionSlice.reducer;
