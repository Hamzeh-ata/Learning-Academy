import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import {
  fetchUniversities,
  createUniversity,
  getUniversityById,
  updateUniversity,
  deleteUniversity
} from '@/services/admin-services/catalog-management-services/universities.service';

const universitiesAdapter = createEntityAdapter();

const initialState = universitiesAdapter.getInitialState({
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
const UniversitiesSlices = createSlice({
  name: 'universities',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchUniversities.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUniversities.fulfilled, (state, action) => {
        universitiesAdapter.setAll(state, action.payload.items);
        const { currentPage, pageSize, totalCount, totalPages, hasNextPage, hasPreviousPage } = action.payload;
        state.pagination = { currentPage, pageSize, totalCount, totalPages, hasNextPage, hasPreviousPage };
        state.loading = false;
      })
      .addCase(fetchUniversities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })

      .addCase(createUniversity.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUniversity.fulfilled, (state, action) => {
        universitiesAdapter.addOne(state, action.payload);
        state.loading = false;
        state.error = null;
      })

      .addCase(updateUniversity.pending, (state) => {
        state.loading = true;
      })

      .addCase(updateUniversity.fulfilled, (state, action) => {
        universitiesAdapter.updateOne(state, { id: action.payload.data.id, changes: action.payload.data });
        state.loading = false;
        state.error = null;
      })

      .addCase(updateUniversity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(deleteUniversity.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUniversity.fulfilled, (state, action) => {
        universitiesAdapter.removeOne(state, action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteUniversity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(createUniversity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getUniversityById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUniversityById.fulfilled, (state, action) => {
        universitiesAdapter.upsertOne(state, action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(getUniversityById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const selectLoading = (state) => state.universities.loading;
export const selectPaginationData = (state) => state.universities.pagination;
export const { selectAll: selectAllUniversities } = universitiesAdapter.getSelectors((state) => state.universities);
export default UniversitiesSlices.reducer;
