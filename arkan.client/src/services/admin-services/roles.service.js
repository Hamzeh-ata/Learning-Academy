import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@api/axios';
import { fetchPages } from '../permission-services/pages.service';

const API_PATH = '/Roles';
const PERMISSIONS_API_PATH = '/RolePagesPermissions';

export const fetchRoles = createAsyncThunk('roles/fetchRoles', async () => {
  const response = await axios.get(API_PATH);
  return response?.data || [];
});

export const addRole = createAsyncThunk('roles/addRole', async (role) => {
  const response = await axios.post(API_PATH, role);
  return response.data;
});

export const deleteRoles = createAsyncThunk('roles/deleteRole', async (role) => {
  await axios.delete(`${API_PATH}/${role.id}`);
  return role.id;
});

export const updateRole = createAsyncThunk('roles/updateRole', async (adminData) => {
  const response = await axios.put(API_PATH, adminData);
  return response.data;
});

/**
 * 
  * export interface Root {
    pagePermissions: PagePermission[]
    permissions: Permission[]
    key: string
  }

  export interface PagePermission {
    pageName: string
    pageId: number
    permissions: number[]
  }

  export interface Permission {
    id: number
    name: string
  }

 */
export const getPagePermissions = createAsyncThunk(`roles/fetchPagePermissions`, async (roleId) => {
  const response = await axios.get(`${PERMISSIONS_API_PATH}/${roleId}`);
  return response.data;
});

/**
 * @param permission  -- {
  "roleId": number,
  "permissions": [
    {
      "pageId": number,
      "permissionIds": number[]
    }
  ]
}
*/
export const addPagePermission = createAsyncThunk('roles/addPagePermission', async (permission, thunkAPI) => {
  try {
    const response = await axios.post(PERMISSIONS_API_PATH, permission);
    thunkAPI.dispatch(fetchPages());
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
