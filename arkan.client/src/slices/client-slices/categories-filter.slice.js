import { createSlice } from '@reduxjs/toolkit';
import { getCategoriesByFilters } from '@services/client-services/categories-filter.service';

const initialState = {
  categories: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
    first: 0,
    hasNextPage: false,
    hasPreviousPage: false
  }
};

const categoriesFilterSlice = createSlice({
  name: 'categoriesFilter',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getCategoriesByFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategoriesByFilters.fulfilled, (state, action) => {
        state.categories = action.payload.items;
        const { currentPage, pageSize, totalCount, totalPages, hasNextPage, hasPreviousPage } = action.payload;
        state.pagination = {
          ...state.pagination,
          currentPage,
          pageSize,
          totalCount,
          totalPages,
          hasNextPage,
          hasPreviousPage
        };

        state.loading = false;
      })
      .addCase(getCategoriesByFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch categories';
      });
  }
});

export const selectPaginationData = (state) => state.categoriesFilter.pagination;
export const selectFilteredCategories = (state) => state.categoriesFilter.categories;
export const selectLoader = (state) => state.categoriesFilter.loading;

export default categoriesFilterSlice.reducer;
