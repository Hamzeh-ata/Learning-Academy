import { addAdmin, deleteAdmin, fetchAdmins, updateAdminInfo } from '@/services/admin-services/user-services';
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const adminsAdapter = createEntityAdapter();

const initialState = adminsAdapter.getInitialState({
  loading: false,
  error: null
});

const AdminsSlice = createSlice({
  name: 'admins',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdmins.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        adminsAdapter.setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })

      // add admin
      .addCase(addAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(addAdmin.fulfilled, (state, action) => {
        adminsAdapter.addOne(state, action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(addAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // delete Admin
      .addCase(deleteAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAdmin.fulfilled, (state, action) => {
        adminsAdapter.removeOne(state, action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      //  updateAdminInfo
      .addCase(updateAdminInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAdminInfo.fulfilled, (state, action) => {
        adminsAdapter.updateOne(state, { id: action.payload.id, changes: action.payload });
        state.loading = false;
        state.error = null;
      })
      .addCase(updateAdminInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const selectAdminsLoading = (state) => state.admins.loading;

export const {
  selectAll: selectAllAdmins
  // Add more selectors if needed
} = adminsAdapter.getSelectors((state) => state.admins);
export default AdminsSlice.reducer;
