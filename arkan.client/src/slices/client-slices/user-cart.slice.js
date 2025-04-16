import { createSlice } from '@reduxjs/toolkit';
import { addCartItem, checkCartCode, deleteCartItem, getUserCart } from '@services/client-services/user-cart.service';

const initialState = {
  data: {
    items: [],
    amount: null,
    discountAmount: null,
    promoCode: '',
    loading: false,
    error: null
  }
};

const UserCart = createSlice({
  name: 'cart',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getUserCart.pending, (state) => {
        state.data.loading = true;
      })
      .addCase(getUserCart.fulfilled, (state, action) => {
        state.data = { discountAmount: state.data.discountAmount, promoCode: state.data.promoCode, ...action.payload };
        state.data.loading = false;
        state.data.error = null;
      })
      .addCase(getUserCart.rejected, (state, action) => {
        state.data.loading = false;
        state.data.error = action.error.message;
      })

      .addCase(deleteCartItem.pending, (state) => {
        state.data.loading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.data.items = state.data.items.filter((e) => e.id !== action.payload);
        state.data.loading = false;
        state.data.error = null;
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.data.loading = false;
        state.data.error = action.error.message;
      })

      .addCase(addCartItem.pending, (state) => {
        state.data.loading = true;
      })
      .addCase(addCartItem.fulfilled, (state, action) => {
        state.data.items.push(action.payload);
        state.data.loading = false;
        state.data.error = null;
      })
      .addCase(addCartItem.rejected, (state, action) => {
        state.data.loading = false;
        state.data.error = action.error.message;
      })
      .addCase(checkCartCode.fulfilled, (state, action) => {
        state.data.discountAmount = action.payload.discountAmount;
        state.data.promoCode = action.payload.promoCode;
      });
  }
});

export const selectUserCart = (state) => state.cart.data;

export default UserCart.reducer;
