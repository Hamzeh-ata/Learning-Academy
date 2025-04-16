import { createSlice } from '@reduxjs/toolkit';
import { getPackagesByFilters } from '@services/client-services/packages-filter.service';

const initialState = {
  packages: [],
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

const packagesFilterSlice = createSlice({
  name: 'packagesFilter',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getPackagesByFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPackagesByFilters.fulfilled, (state, action) => {
        state.packages = action.payload.items;
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
      .addCase(getPackagesByFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch packages';
      });
  }
});

export const selectPaginationData = (state) => state.packagesFilter.pagination;
export const selectFilteredPackages = (state) => state.packagesFilter.packages;
export const selectLoader = (state) => state.packagesFilter.loading;

export default packagesFilterSlice.reducer;
