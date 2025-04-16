import { USER_TOKEN } from '@constants';
import { createSlice } from '@reduxjs/toolkit';
import { loginUser, logout, registerUser } from '@services/auth/auth.service';
import { fetchPages } from '@services/permission-services/pages.service';

const userInfo = localStorage.getItem(USER_TOKEN) ? JSON.parse(localStorage.getItem(USER_TOKEN)) : null;

const initialState = {
  loading: false,
  userInfo: userInfo || null,
  userToken: userInfo?.token || null,
  error: null,
  success: false,
  pagePermissions: null,
  status: 'idle',
  showLoginModal: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    openLoginModal: (state) => {
      state.showLoginModal = true;
    },
    closeLoginModal: (state) => {
      state.showLoginModal = false;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.status = 'loading';
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.loading = false;
      state.userInfo = action.payload;
      state.userToken = action.payload.token;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.status = 'failed';
      state.loading = false;
      state.error = action.payload?.key;
    });
    builder.addCase(registerUser.pending, (state) => {
      state.status = 'loading';
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.loading = false;
      state.userInfo = action.payload;
      state.userToken = action.payload.token;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.status = 'failed';
      state.loading = false;
      state.error = action.payload?.key;
    });

    builder.addCase(fetchPages.pending, (state) => {
      state.status = 'loading';
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchPages.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.loading = false;
      state.pagePermissions = action.payload;
    });

    builder.addCase(fetchPages.rejected, (state, action) => {
      state.status = 'failed';
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(logout.pending, (state) => {
      state.loading = true;
      state.status = 'loading';
    });
    builder.addCase(logout.fulfilled, (state) => {
      localStorage.removeItem(USER_TOKEN);
      state.userToken = null;
      state.userInfo = null;
      state.status = 'idle';
      state.loading = false;
      state.error = null;
      state.pagePermissions = null;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.status = 'failed';
      state.loading = false;
      state.error = action.payload?.key;
    });
  }
});
export const selectOpenLoginModal = (state) => state.auth.showLoginModal;
export const selectLoading = (state) => state.auth.loading;
export const selectUserInfo = (state) => state.auth.userInfo;
export const selectPagePermissions = (state) => state.auth.pagePermissions;

export const { openLoginModal, closeLoginModal } = authSlice.actions;
export default authSlice.reducer;
