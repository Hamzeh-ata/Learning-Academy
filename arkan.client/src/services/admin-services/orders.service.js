import axios from '@api/axios';
import { buildQueryString } from '@api/query-builder';
import { createAsyncThunk } from '@reduxjs/toolkit';

const PENDING_API_PATH = '/PendingOrders';
const PAYMENT_ORDER_API_PATH = '/OrderPayments';
const CONFIRMED_ORDERS_API_PATH = '/ConfirmedOrders';

export const fetchPendingOrders = createAsyncThunk('orders/fetchPendingOrders', async (filters) => {
  const queryString = buildQueryString(filters);
  const url = `/OrderFilters${PENDING_API_PATH}?${queryString}`;
  const response = await axios.get(url);
  return response.data;
});

export const deletePendingOrders = createAsyncThunk('orders/deletePendingOrders', async (pendingOrdersIds) => {
  await axios.post(PENDING_API_PATH, pendingOrdersIds);
  return pendingOrdersIds;
});

export const deleteConfirmedOrders = createAsyncThunk('orders/deleteConfirmedOrders', async (confirmedOrdersIds) => {
  await axios.post(`${CONFIRMED_ORDERS_API_PATH}/Delete`, confirmedOrdersIds);
  return confirmedOrdersIds;
});

export const confirmOrders = createAsyncThunk('orders/confirmOrders', async (pendingOrdersIds) => {
  await axios.post(`${PENDING_API_PATH}/ConfirmOrders`, pendingOrdersIds);
  return pendingOrdersIds;
});

/**
 * {
  "orderId": 0,
  "amountPaid": 0,
}
 */
export const postOrderPayment = createAsyncThunk('orders/postOrderPayment', async (orderPayment) => {
  const response = await axios.post(PAYMENT_ORDER_API_PATH, orderPayment);
  return response.data;
});

export const deleteOrderPayment = createAsyncThunk('orders/deleteOrderPayment', async (paymentId) => {
  await axios.delete(`${PAYMENT_ORDER_API_PATH}/${paymentId}`);
  return paymentId;
});

export const getOrderPayments = createAsyncThunk('orders/getOrderPayments', async (orderId) => {
  const response = await axios.get(`${PAYMENT_ORDER_API_PATH}/${orderId}`);
  return response.data;
});

export const downloadOrdersExcel = createAsyncThunk('orders/export', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${CONFIRMED_ORDERS_API_PATH}/export`, {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'ConfirmedOrders.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const downloadOrderExcel = createAsyncThunk('order/export', async (orderId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${CONFIRMED_ORDERS_API_PATH}/export${orderId}`, {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Order.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const fetchConfirmedOrders = createAsyncThunk('orders/fetchConfirmedOrders', async (filters) => {
  const queryString = buildQueryString(filters);
  const url = `/OrderFilters${CONFIRMED_ORDERS_API_PATH}?${queryString}`;
  const response = await axios.get(url);
  return response.data;
});
