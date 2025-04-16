import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import {
  fetchRoles,
  addRole,
  deleteRoles,
  updateRole,
  getPagePermissions,
  addPagePermission
} from '@services/admin-services/roles.service';

const rolesAdapter = createEntityAdapter();

const initialState = rolesAdapter.getInitialState({
  loading: false,
  error: null,
  permissions: {
    pagePermissions: [],
    permissions: []
  }
});

const RolesSlice = createSlice({
  name: 'roles',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        rolesAdapter.setAll(state, action.payload.rolesModel);
        state.loading = false;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })

      .addCase(addRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(addRole.fulfilled, (state, action) => {
        rolesAdapter.addOne(state, action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(addRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(deleteRoles.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteRoles.fulfilled, (state, action) => {
        rolesAdapter.removeOne(state, action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        rolesAdapter.updateOne(state, { id: action.payload.id, changes: action.payload });
        state.loading = false;
        state.error = null;
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(getPagePermissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPagePermissions.fulfilled, (state, action) => {
        state.permissions = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getPagePermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addPagePermission.pending, (state) => {
        state.loading = true;
      })
      .addCase(addPagePermission.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addPagePermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const selectLoading = (state) => state.roles.loading;
export const selectPermissions = (state) => state.roles.permissions;

export const { selectAll: selectAllRoles } = rolesAdapter.getSelectors((state) => state.roles);
export default RolesSlice.reducer;
