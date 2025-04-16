import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { createCRUDThunks, reducerActions } from '@api/utils';

const arkanCodesAdapter = createEntityAdapter();

const API_ENDPOINT = '/ArkanCode';

export const arkanCodesThunks = createCRUDThunks('arkanCodes', API_ENDPOINT);

const initialState = arkanCodesAdapter.getInitialState({
  loading: false,
  error: null
});

const ArkanCodesSlice = createSlice({
  name: 'arkanCodes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const { fetchAll, create, update, delete: deleteCode, get } = arkanCodesThunks;
    builder
      .addCase(fetchAll.pending, reducerActions.handlePending)
      .addCase(fetchAll.fulfilled, reducerActions.handleFulfilled(arkanCodesAdapter.setAll))
      .addCase(fetchAll.rejected, reducerActions.handleRejected)

      .addCase(create.pending, reducerActions.handlePending)
      .addCase(create.fulfilled, reducerActions.handleFulfilled(arkanCodesAdapter.addOne))
      .addCase(create.rejected, reducerActions.handleRejected)

      .addCase(update.pending, reducerActions.handlePending)
      .addCase(update.fulfilled, (state, action) => {
        arkanCodesAdapter.updateOne(state, { id: action.payload.id, changes: action.payload });
        state.loading = false;
        state.error = null;
      })
      .addCase(update.rejected, reducerActions.handleRejected)

      .addCase(deleteCode.pending, reducerActions.handlePending)
      .addCase(deleteCode.fulfilled, reducerActions.handleFulfilled(arkanCodesAdapter.removeOne))
      .addCase(deleteCode.rejected, reducerActions.handleRejected)

      .addCase(get.pending, reducerActions.handlePending)
      .addCase(get.fulfilled, reducerActions.handleFulfilled(arkanCodesAdapter.upsertOne))
      .addCase(get.rejected, reducerActions.handleRejected);
  }
});

export const selectLoading = (state) => state.arkanCodes.loading;

export const { selectAll: selectAllArkanCodes, selectById: selectPackageById } = arkanCodesAdapter.getSelectors(
  (state) => state.arkanCodes
);

export const { reducer: arkanCodeReducer } = ArkanCodesSlice;
export default ArkanCodesSlice.reducer;
