import { heroThunks } from '@/services/admin-services/admin-content-management.service';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {
    description: '',
    headerText: '',
    id: null,
    image: '',
    loading: false,
    error: null
  }
};

const heroSectionSlice = createSlice({
  name: 'adminContentManagement/heroSection',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(heroThunks.get.pending, (state) => {
        state.data.loading = true;
      })
      .addCase(heroThunks.get.fulfilled, (state, action) => {
        state.data = { ...action.payload };
        state.data.loading = false;
        state.data.error = null;
      })
      .addCase(heroThunks.get.rejected, (state, action) => {
        state.data.loading = false;
        state.data.error = action.error.message;
      })

      .addCase(heroThunks.update.pending, (state) => {
        state.data.loading = true;
      })
      .addCase(heroThunks.update.fulfilled, (state, action) => {
        state.data = { ...action.payload };
        state.data.loading = false;
        state.data.error = null;
      })
      .addCase(heroThunks.update.rejected, (state, action) => {
        state.data.loading = false;
        state.data.error = action.error.message;
      })

      .addCase(heroThunks.create.pending, (state) => {
        state.data.loading = true;
      })
      .addCase(heroThunks.create.fulfilled, (state, action) => {
        state.data = { ...action.payload };
        state.data.loading = false;
        state.data.error = null;
      })
      .addCase(heroThunks.create.rejected, (state, action) => {
        state.data.loading = false;
        state.data.error = action.error.message;
      });
  }
});

export const selectHeroSection = (state) => state.adminContentManagement.heroSection.data;

export default heroSectionSlice.reducer;
