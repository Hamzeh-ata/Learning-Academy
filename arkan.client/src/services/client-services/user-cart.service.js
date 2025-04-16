import axios from '@api/axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const API_PATH = '/UserCart';
const CHECKOUT_API_PATH = '/CheckOut';
const CART_CODE_API_PATH = '/CartArkanCode';
const CHECKOUT_CODE_API_PATH = '/PromoCode/Check';

export const getUserCart = createAsyncThunk('cart/getUserCart', async () => {
  const response = await axios.get(API_PATH);
  return response?.data;
});

export const deleteCartItem = createAsyncThunk('cart/deleteCartItem', async (cartItemId) => {
  await axios.delete(`${API_PATH}/${cartItemId}`);
  return cartItemId;
});

/**
* @param cartItem -- {
  "itemId": 0,
  "type": PRODUCT_TYPE
}
 */
export const addCartItem = createAsyncThunk('cart/addCartItem', async (cartItem) => {
  const response = await axios.post(API_PATH, cartItem);
  return response.data;
});

export const checkoutCart = createAsyncThunk('cart/checkoutCart', async (code) => {
  const response = await axios.post(`${CHECKOUT_API_PATH}?code=${code}`);
  return response.data;
});

export const addCartCode = createAsyncThunk('cart/addCartCode', async (codeObject) => {
  const response = await axios.post(`${CART_CODE_API_PATH}?code=${codeObject.code}&itemId=${codeObject.itemId}`);
  return response.data;
});

export const removeCartCode = createAsyncThunk('cart/removeCartCode', async (itemId) => {
  await axios.delete(`${CART_CODE_API_PATH}/${itemId}`);
  return itemId;
});

export const checkCartCode = createAsyncThunk('cart/checkCartCode', async (codeObject) => {
  const response = await axios.post(
    `${CHECKOUT_CODE_API_PATH}?code=${codeObject.code}&orderAmount=${codeObject.orderAmount}`
  );
  return response?.data ? { ...response.data, promoCode: codeObject.code } : null;
});
