import { categoriesSectionThunks } from '@/services/admin-services/admin-content-management.service';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {
    categories: [],
    loading: false,
    error: null
  }
};

const categoriesSectionSlice = createSlice({
  name: 'adminContentManagement/categoriesSection',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(categoriesSectionThunks.get.pending, (state) => {
        state.data.loading = true;
      })
      .addCase(categoriesSectionThunks.get.fulfilled, (state, action) => {
        state.data.categories = action.payload;
        state.data.loading = false;
        state.data.error = null;
      })
      .addCase(categoriesSectionThunks.get.rejected, (state, action) => {
        state.data.loading = false;
        state.data.error = action.error.message;
      })

      .addCase(categoriesSectionThunks.create.pending, (state) => {
        state.data.loading = true;
      })
      .addCase(categoriesSectionThunks.create.fulfilled, (state, action) => {
        state.data.categories.push(action.payload);
        state.data.loading = false;
        state.data.error = null;
      })
      .addCase(categoriesSectionThunks.create.rejected, (state, action) => {
        state.data.loading = false;
        state.data.error = action.error.message;
      })

      .addCase(categoriesSectionThunks.delete.pending, (state) => {
        state.data.loading = true;
      })
      .addCase(categoriesSectionThunks.delete.fulfilled, (state, action) => {
        state.data.categories = state.data.categories.filter((category) => category.id !== action.payload);
        state.data.loading = false;
      })
      .addCase(categoriesSectionThunks.delete.rejected, (state, action) => {
        state.data.loading = false;
        state.data.error = action.error.message;
      });
  }
});

export const selectCategoriesSection = (state) => state.adminContentManagement.categoriesSection.data;

export default categoriesSectionSlice.reducer;
