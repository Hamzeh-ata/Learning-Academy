import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { liveStreamThunks } from '@/services/client-services/live-stream.service';

const liveStreamAdapter = createEntityAdapter();

const initialState = liveStreamAdapter.getInitialState({
  loading: false,
  error: null
});

const LiveStreamSlice = createSlice({
  name: 'liveStream',
  initialState,
  extraReducers: (builder) => {
    const { get, getOne, delete: deleteLiveStream, update, toggleLive, create } = liveStreamThunks;
    const handlePending = (state) => {
      state.loading = true;
    };
    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    };
    builder
      .addCase(get.pending, handlePending) // get all live streams
      .addCase(get.fulfilled, (state, action) => {
        liveStreamAdapter.setAll(state, action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(get.rejected, handleRejected) // get all live streams

      .addCase(getOne.pending, handlePending) // get one live stream
      .addCase(getOne.fulfilled, (state, action) => {
        liveStreamAdapter.upsertOne(state, action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(getOne.rejected, handleRejected) // get one live stream

      .addCase(create.pending, handlePending) // create live stream
      .addCase(create.fulfilled, (state, action) => {
        liveStreamAdapter.addOne(state, action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(create.rejected, handleRejected) // create live stream

      .addCase(update.pending, handlePending) // update live stream
      .addCase(update.fulfilled, (state, action) => {
        liveStreamAdapter.updateOne(state, action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(update.rejected, handleRejected) // update live stream

      .addCase(deleteLiveStream.pending, handlePending) // delete live stream
      .addCase(deleteLiveStream.fulfilled, (state, action) => {
        liveStreamAdapter.removeOne(state, action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteLiveStream.rejected, handleRejected) // delete live stream

      .addCase(toggleLive.pending, handlePending) // start live stream
      .addCase(toggleLive.fulfilled, (state) => {
        // liveStreamAdapter.upsertOne(state, action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(toggleLive.rejected, handleRejected); // start live stream
  }
}); // get all live streams

export default LiveStreamSlice.reducer;
export const { selectAll: selectLiveStreams } = liveStreamAdapter.getSelectors((state) => state.liveStream);

export const selectLiveStream = (state, id) => liveStreamAdapter.getSelectors().selectById(state.liveStream, id);
export const selectLoading = (state) => state.liveStream.loading;
