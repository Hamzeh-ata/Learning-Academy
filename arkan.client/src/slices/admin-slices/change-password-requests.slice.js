import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { fetchRequests, deleteRequest, acceptRequest } from '@services/admin-services/change-password-requests.service';

const changePasswordRequestsAdapter = createEntityAdapter();

const initialState = changePasswordRequestsAdapter.getInitialState({
  loading: false,
  error: null
});

const ChangePasswordRequestsSlices = createSlice({
  name: 'changePasswordRequests',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        changePasswordRequestsAdapter.setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(deleteRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteRequest.fulfilled, (state, action) => {
        changePasswordRequestsAdapter.removeOne(state, action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(acceptRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(acceptRequest.fulfilled, (state, action) => {
        changePasswordRequestsAdapter.removeOne(state, action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(acceptRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const selectLoading = (state) => state.changePasswordRequests.loading;

export const {
  selectAll: selectAllRequests
  // Add more selectors if needed
} = changePasswordRequestsAdapter.getSelectors((state) => state.changePasswordRequests);
export default ChangePasswordRequestsSlices.reducer;
