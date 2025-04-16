import { universitiesSectionThunks } from '@/services/admin-services/admin-content-management.service';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {
    universities: [],
    loading: false,
    error: null
  }
};

const universitiesSectionSlice = createSlice({
  name: 'adminContentManagement/universitiesSection',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(universitiesSectionThunks.get.pending, (state) => {
        state.data.loading = true;
      })
      .addCase(universitiesSectionThunks.get.fulfilled, (state, action) => {
        state.data.universities = action.payload;
        state.data.loading = false;
        state.data.error = null;
      })
      .addCase(universitiesSectionThunks.get.rejected, (state, action) => {
        state.data.loading = false;
        state.data.error = action.error.message;
      })

      .addCase(universitiesSectionThunks.create.pending, (state) => {
        state.data.loading = true;
      })
      .addCase(universitiesSectionThunks.create.fulfilled, (state, action) => {
        state.data.universities.push(action.payload);
        state.data.loading = false;
        state.data.error = null;
      })
      .addCase(universitiesSectionThunks.create.rejected, (state, action) => {
        state.data.loading = false;
        state.data.error = action.error.message;
      })

      .addCase(universitiesSectionThunks.delete.pending, (state) => {
        state.data.loading = true;
      })
      .addCase(universitiesSectionThunks.delete.fulfilled, (state, action) => {
        state.data.universities = state.data.universities.filter((course) => course.id !== action.payload);
        state.data.loading = false;
      })
      .addCase(universitiesSectionThunks.delete.rejected, (state, action) => {
        state.data.loading = false;
        state.data.error = action.error.message;
      });
  }
});

export const selectUniversitiesSection = (state) => state.adminContentManagement.universitiesSection.data;

export default universitiesSectionSlice.reducer;
