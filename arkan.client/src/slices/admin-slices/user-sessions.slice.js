import { createCRUDThunks } from '@/api/utils';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const API_ENDPOINT = '/UserSessions';
const sliceName = 'userSessions';

export const userSessionsThunks = createCRUDThunks(sliceName, API_ENDPOINT);

const userSessionsAdapter = createEntityAdapter();

const initialState = userSessionsAdapter.getInitialState({
  loading: false,
  error: null
});

const UserSessionsSlice = createSlice({
  name: sliceName,
  initialState,
  extraReducers: (builder) => {
    const { fetchAll, delete: deleteNotification, get } = userSessionsThunks;

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
      .addCase(fetchAll.fulfilled, handleFulfilled(userSessionsAdapter.setAll))
      .addCase(fetchAll.rejected, handleRejected)

      .addCase(deleteNotification.pending, handlePending)
      .addCase(deleteNotification.fulfilled, handleFulfilled(userSessionsAdapter.removeOne))
      .addCase(deleteNotification.rejected, handleRejected)

      .addCase(get.pending, handlePending)
      .addCase(get.fulfilled, handleFulfilled(userSessionsAdapter.upsertOne))
      .addCase(get.rejected, handleRejected);
  }
});

export const selectLoading = (state) => state.userSessions.loading;
export const selectError = (state) => state.userSessions.error;

export const { selectAll: selectAllUsersSessions, selectById: selectSessionByUserId } =
  userSessionsAdapter.getSelectors((state) => state.userSessions);

export const { reducer: UserSessionsReducer } = UserSessionsSlice;

export default UserSessionsSlice.reducer;
