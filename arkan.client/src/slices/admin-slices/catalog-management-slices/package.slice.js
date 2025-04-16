import { createCRUDThunks } from '@api/utils';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const API_ENDPOINT = '/Package';

export const packagesThunks = createCRUDThunks('packages', API_ENDPOINT, true);

const packagesAdapter = createEntityAdapter();

const initialState = packagesAdapter.getInitialState({
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

const PackagesSlice = createSlice({
  name: 'packages',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const { fetchPaginated, create, update, delete: deletePackage, get } = packagesThunks;

    const handlePending = (state) => {
      state.loading = true;
    };
    const handleFulfilled = (adapterMethod) => (state, action) => {
      adapterMethod(state, action.payload);
      state.loading = false;
      state.error = null;
    };

    const handlePagination = (state, action) => {
      const { currentPage, pageSize, totalCount, totalPages, hasNextPage, hasPreviousPage } = action.payload;
      state.pagination = { currentPage, pageSize, totalCount, totalPages, hasNextPage, hasPreviousPage };
    };

    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    };

    builder
      .addCase(fetchPaginated.pending, handlePending)
      .addCase(fetchPaginated.fulfilled, (state, action) => {
        handlePagination(state, action);
        packagesAdapter.setAll(state, action.payload.items);
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchPaginated.rejected, handleRejected)

      .addCase(create.pending, handlePending)
      .addCase(create.fulfilled, handleFulfilled(packagesAdapter.addOne))
      .addCase(create.rejected, handleRejected)

      .addCase(update.pending, handlePending)
      .addCase(update.fulfilled, (state, action) => {
        packagesAdapter.updateOne(state, { id: action.payload.id, changes: action.payload });
        state.loading = false;
        state.error = null;
      })
      .addCase(update.rejected, handleRejected)

      .addCase(deletePackage.pending, handlePending)
      .addCase(deletePackage.fulfilled, handleFulfilled(packagesAdapter.removeOne))
      .addCase(deletePackage.rejected, handleRejected)

      .addCase(get.pending, handlePending)
      .addCase(get.fulfilled, handleFulfilled(packagesAdapter.upsertOne))
      .addCase(get.rejected, handleRejected);
  }
});

export const selectLoading = (state) => state.packages.loading;
export const selectError = (state) => state.packages.error;
export const selectPagination = (state) => state.packages.pagination;

export const { selectAll: selectAllPackages, selectById: selectPackageById } = packagesAdapter.getSelectors(
  (state) => state.packages
);
export const { reducer: packagesReducer } = PackagesSlice;
export default PackagesSlice.reducer;
