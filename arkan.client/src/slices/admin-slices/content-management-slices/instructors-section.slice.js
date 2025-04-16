import { instructorsSectionThunks } from '@/services/admin-services/admin-content-management.service';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {
    instructors: [],
    loading: false,
    error: null
  }
};

const instructorsSectionSlice = createSlice({
  name: 'adminContentManagement/instructorsSection',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(instructorsSectionThunks.get.pending, (state) => {
        state.data.loading = true;
      })
      .addCase(instructorsSectionThunks.get.fulfilled, (state, action) => {
        state.data.instructors = action.payload;
        state.data.loading = false;
        state.data.error = null;
      })
      .addCase(instructorsSectionThunks.get.rejected, (state, action) => {
        state.data.loading = false;
        state.data.error = action.error.message;
      })

      .addCase(instructorsSectionThunks.create.pending, (state) => {
        state.data.loading = true;
      })
      .addCase(instructorsSectionThunks.create.fulfilled, (state, action) => {
        state.data.instructors.push(action.payload);
        state.data.loading = false;
        state.data.error = null;
      })
      .addCase(instructorsSectionThunks.create.rejected, (state, action) => {
        state.data.loading = false;
        state.data.error = action.error.message;
      })

      .addCase(instructorsSectionThunks.delete.pending, (state) => {
        state.data.loading = true;
      })
      .addCase(instructorsSectionThunks.delete.fulfilled, (state, action) => {
        state.data.instructors = state.data.instructors.filter((course) => course.id !== action.payload);
        state.data.loading = false;
      })
      .addCase(instructorsSectionThunks.delete.rejected, (state, action) => {
        state.data.loading = false;
        state.data.error = action.error.message;
      });
  }
});

export const selectInstructorsSection = (state) => state.adminContentManagement.instructorsSection.data;

export default instructorsSectionSlice.reducer;
