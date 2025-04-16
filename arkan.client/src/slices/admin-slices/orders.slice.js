import { createSlice } from '@reduxjs/toolkit';
import {
  confirmOrders,
  deleteOrderPayment,
  deletePendingOrders,
  fetchConfirmedOrders,
  fetchPendingOrders,
  getOrderPayments,
  postOrderPayment,
  downloadOrdersExcel,
  downloadOrderExcel,
  deleteConfirmedOrders
} from '@services/admin-services/orders.service';

const initialState = {
  orderPayment: {
    orderAmount: null,
    totalPayments: null,
    remainingAmount: null,
    payments: [],
    loading: false,
    error: null
  },
  pendingOrders: {
    items: [],
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false
    }
  },
  confirmedOrders: {
    items: [],
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false
    }
  }
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingOrders.pending, (state) => {
        state.pendingOrders.loading = true;
        state.pendingOrders.error = null;
      })
      .addCase(fetchPendingOrders.fulfilled, (state, action) => {
        state.pendingOrders.items = action.payload.items;
        const { currentPage, pageSize, totalCount, totalPages, hasNextPage, hasPreviousPage } = action.payload;
        state.pendingOrders.pagination = {
          currentPage,
          pageSize,
          totalCount,
          totalPages,
          hasNextPage,
          hasPreviousPage
        };
        state.pendingOrders.loading = false;
      })
      .addCase(fetchPendingOrders.rejected, (state, action) => {
        state.pendingOrders.loading = false;
        state.pendingOrders.error = action.payload || 'Failed to fetch pending orders';
      })

      .addCase(deletePendingOrders.pending, (state) => {
        state.pendingOrders.loading = true;
        state.pendingOrders.error = null;
      })
      .addCase(deletePendingOrders.fulfilled, (state, action) => {
        state.pendingOrders.items = state.pendingOrders.items.filter((e) => !action.payload?.includes(e.id));
        state.pendingOrders.loading = false;
      })
      .addCase(deletePendingOrders.rejected, (state) => {
        state.pendingOrders.loading = false;
        state.pendingOrders.error = 'Failed to delete pending orders';
      })

      .addCase(deleteConfirmedOrders.pending, (state) => {
        state.confirmedOrders.loading = true;
        state.confirmedOrders.error = null;
      })
      .addCase(deleteConfirmedOrders.fulfilled, (state, action) => {
        state.confirmedOrders.items = state.confirmedOrders.items.filter((e) => !action.payload?.includes(e.id));
        state.confirmedOrders.loading = false;
      })
      .addCase(deleteConfirmedOrders.rejected, (state) => {
        state.confirmedOrders.loading = false;
        state.confirmedOrders.error = 'Failed to delete confirmed orders';
      })

      .addCase(confirmOrders.pending, (state) => {
        state.pendingOrders.loading = true;
        state.pendingOrders.error = null;
      })
      .addCase(confirmOrders.fulfilled, (state, action) => {
        state.pendingOrders.items = state.pendingOrders.items.filter((e) => !action.payload?.includes(e.id));
        state.pendingOrders.loading = false;
      })
      .addCase(confirmOrders.rejected, (state) => {
        state.pendingOrders.loading = false;
        state.pendingOrders.error = 'Failed to confirm orders';
      })

      .addCase(fetchConfirmedOrders.pending, (state) => {
        state.confirmedOrders.loading = true;
        state.confirmedOrders.error = null;
      })
      .addCase(fetchConfirmedOrders.fulfilled, (state, action) => {
        state.confirmedOrders.items = action.payload.items;
        const { currentPage, pageSize, totalCount, totalPages, hasNextPage, hasPreviousPage } = action.payload;
        state.confirmedOrders.pagination = {
          currentPage,
          pageSize,
          totalCount,
          totalPages,
          hasNextPage,
          hasPreviousPage
        };
        state.confirmedOrders.loading = false;
      })
      .addCase(fetchConfirmedOrders.rejected, (state, action) => {
        state.confirmedOrders.loading = false;
        state.confirmedOrders.error = action.payload || 'Failed to fetch confirmed orders';
      })

      .addCase(getOrderPayments.pending, (state) => {
        state.orderPayment.loading = true;
        state.orderPayment.error = null;
      })
      .addCase(getOrderPayments.fulfilled, (state, action) => {
        state.orderPayment = { ...action.payload };
        state.orderPayment.loading = false;
      })
      .addCase(getOrderPayments.rejected, (state, action) => {
        state.orderPayment.loading = false;
        state.orderPayment.error = action.payload || 'Failed to fetch order Payment';
      })

      .addCase(postOrderPayment.pending, (state) => {
        state.orderPayment.loading = true;
        state.orderPayment.error = null;
      })
      .addCase(postOrderPayment.fulfilled, (state, action) => {
        state.orderPayment.loading = false;
        state.orderPayment.payments.push(action.payload);
        state.orderPayment.error = null;
      })
      .addCase(postOrderPayment.rejected, (state, action) => {
        state.orderPayment.loading = false;
        state.orderPayment.error = action.payload || 'Failed to add order Payment';
      })
      .addCase(deleteOrderPayment.pending, (state) => {
        state.orderPayment.loading = true;
        state.orderPayment.error = null;
      })
      .addCase(deleteOrderPayment.fulfilled, (state, action) => {
        state.orderPayment.payments = state.orderPayment.payments.filter((e) => action.payload != e.id);
        state.orderPayment.loading = false;
      })
      .addCase(deleteOrderPayment.rejected, (state) => {
        state.orderPayment.loading = false;
        state.orderPayment.error = 'Failed to delete payment';
      })

      .addCase(downloadOrdersExcel.pending, (state) => {
        state.confirmedOrders.loading = true;
        state.confirmedOrders.error = null;
      })
      .addCase(downloadOrdersExcel.fulfilled, (state) => {
        state.confirmedOrders.loading = false;
      })
      .addCase(downloadOrdersExcel.rejected, (state, action) => {
        state.confirmedOrders.loading = false;
        state.confirmedOrders.error = action.payload || 'Failed to export orders';
      })

      .addCase(downloadOrderExcel.pending, (state) => {
        state.confirmedOrders.loading = true;
        state.confirmedOrders.error = null;
      })
      .addCase(downloadOrderExcel.fulfilled, (state) => {
        state.confirmedOrders.loading = false;
      })
      .addCase(downloadOrderExcel.rejected, (state, action) => {
        state.confirmedOrders.loading = false;
        state.confirmedOrders.error = action.payload || 'Failed to export order';
      });
  }
});

export const selectPendingOrdersPaginationData = (state) => state.orders?.pendingOrders?.pagination;
export const selectPendingOrders = (state) => state.orders?.pendingOrders?.items;
export const selectPendingOrdersLoader = (state) => state.orders?.pendingOrders?.loading;

export const selectConfirmedOrdersPaginationData = (state) => state.orders?.confirmedOrders?.pagination;
export const selectConfirmedOrders = (state) => state.orders?.confirmedOrders?.items;
export const selectConfirmedOrdersLoader = (state) => state.orders?.confirmedOrders?.loading;

export const selectOrderPayments = (state) => state.orders?.orderPayment;

export default ordersSlice.reducer;
