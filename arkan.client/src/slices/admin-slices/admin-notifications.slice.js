import { createCRUDThunks } from '@api/utils';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const API_ENDPOINT = '/HumanMadeNotifications';

export const adminNotificationsThunks = createCRUDThunks('adminNotifications', API_ENDPOINT);

const adminNotificationsAdapter = createEntityAdapter();

const initialState = adminNotificationsAdapter.getInitialState({
  loading: false,
  error: null
});

const AdminNotificationsSlice = createSlice({
  name: 'adminNotifications',
  initialState,
  extraReducers: (builder) => {
    const { fetchAll, create, update, delete: deleteNotification, get } = adminNotificationsThunks;

    const handlePending = (state) => {
      state.loading = true;
    };
    const handleFulfilled = (adapterMethod) => (state, action) => {
      adapterMethod(state, action.payload);
      state.loading = false;
      state.error = null;
    };

    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    };

    builder
      .addCase(fetchAll.pending, handlePending)
      .addCase(fetchAll.fulfilled, handleFulfilled(adminNotificationsAdapter.setAll))
      .addCase(fetchAll.rejected, handleRejected)

      .addCase(create.pending, handlePending)
      .addCase(create.fulfilled, handleFulfilled(adminNotificationsAdapter.addOne))
      .addCase(create.rejected, handleRejected)

      .addCase(update.pending, handlePending)
      .addCase(update.fulfilled, (state, action) => {
        adminNotificationsAdapter.updateOne(state, { id: action.payload.id, changes: action.payload });
        state.loading = false;
        state.error = null;
      })
      .addCase(update.rejected, handleRejected)

      .addCase(deleteNotification.pending, handlePending)
      .addCase(deleteNotification.fulfilled, handleFulfilled(adminNotificationsAdapter.removeOne))
      .addCase(deleteNotification.rejected, handleRejected)

      .addCase(get.pending, handlePending)
      .addCase(get.fulfilled, handleFulfilled(adminNotificationsAdapter.upsertOne))
      .addCase(get.rejected, handleRejected);
  }
});

export const selectLoading = (state) => state.adminNotifications.loading;
export const selectError = (state) => state.adminNotifications.error;

export const { selectAll: selectAllNotifications, selectById: selectByNotificationId } =
  adminNotificationsAdapter.getSelectors((state) => state.adminNotifications);
export const { reducer: AdminNotificationsReducer } = AdminNotificationsSlice;
export default AdminNotificationsSlice.reducer;
