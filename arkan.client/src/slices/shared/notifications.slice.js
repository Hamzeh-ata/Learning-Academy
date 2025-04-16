import { deleteNotificationsThunks, notificationsThunks } from '@/services/shared/notifications.service';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  loading: false,
  error: null
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(notificationsThunks.get.pending, (state) => {
        state.loading = true;
      })
      .addCase(notificationsThunks.get.fulfilled, (state, action) => {
        state.notifications = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(notificationsThunks.get.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(deleteNotificationsThunks.delete.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteNotificationsThunks.delete.fulfilled, (state, action) => {
        const notificationIds = action.payload;
        state.notifications = state.notifications.filter((notification) => !notificationIds.includes(notification.id));
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteNotificationsThunks.delete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const selectNotifications = (state) => state.notifications;

export default notificationsSlice.reducer;
