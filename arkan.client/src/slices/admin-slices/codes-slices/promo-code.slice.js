import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { createCRUDThunks, reducerActions } from '@api/utils';

const promoCodeAdapter = createEntityAdapter();

const API_ENDPOINT = '/PromoCode';

export const promoCodeThunks = createCRUDThunks('promoCode', API_ENDPOINT);

const initialState = promoCodeAdapter.getInitialState({
  loading: false,
  error: null
});

const PromoCodeSlice = createSlice({
  name: 'promoCode',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const { fetchAll, create, update, delete: deleteCode, get } = promoCodeThunks;
    builder
      .addCase(fetchAll.pending, reducerActions.handlePending)
      .addCase(fetchAll.fulfilled, reducerActions.handleFulfilled(promoCodeAdapter.setAll))
      .addCase(fetchAll.rejected, reducerActions.handleRejected)

      .addCase(create.pending, reducerActions.handlePending)
      .addCase(create.fulfilled, reducerActions.handleFulfilled(promoCodeAdapter.addOne))
      .addCase(create.rejected, reducerActions.handleRejected)

      .addCase(update.pending, reducerActions.handlePending)
      .addCase(update.fulfilled, (state, action) => {
        promoCodeAdapter.updateOne(state, { id: action.payload.id, changes: action.payload });
        state.loading = false;
        state.error = null;
      })
      .addCase(update.rejected, reducerActions.handleRejected)

      .addCase(deleteCode.pending, reducerActions.handlePending)
      .addCase(deleteCode.fulfilled, reducerActions.handleFulfilled(promoCodeAdapter.removeOne))
      .addCase(deleteCode.rejected, reducerActions.handleRejected)

      .addCase(get.pending, reducerActions.handlePending)
      .addCase(get.fulfilled, reducerActions.handleFulfilled(promoCodeAdapter.upsertOne))
      .addCase(get.rejected, reducerActions.handleRejected);
  }
});

export const selectLoading = (state) => state.promoCode.loading;

export const { selectAll: selectAllPromoCodes, selectById: selectPackageById } = promoCodeAdapter.getSelectors(
  (state) => state.promoCode
);

export const { reducer: promoCodeReducer } = PromoCodeSlice;
