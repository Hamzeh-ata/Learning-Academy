import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { fetchActivitesLog } from '@services/admin-services/activity-log.service';

const activitesLogAdapter = createEntityAdapter();

const initialState = activitesLogAdapter.getInitialState({
  items: [],
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

const ActvitesLogSlice = createSlice({
  name: 'actvitesLog',
  initialState,
  reducers: {
    resetActivityLogState: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivitesLog.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchActivitesLog.fulfilled, (state, action) => {
        state.items = action.payload.items;
        const { currentPage, pageSize, totalCount, totalPages, hasNextPage, hasPreviousPage } = action.payload;
        state.pagination = { currentPage, pageSize, totalCount, totalPages, hasNextPage, hasPreviousPage };
        state.loading = false;
      })
      .addCase(fetchActivitesLog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  }
});

export const selectLoading = (state) => state.actvitesLog.loading;
export const selectPaginationData = (state) => state.actvitesLog.pagination;
export const selectActivitesLog = (state) => state.actvitesLog.items;
export const selectAllActivites = (state) => state.actvitesLog.items;
export const { resetActivityLogState } = ActvitesLogSlice.actions;
export default ActvitesLogSlice.reducer;
