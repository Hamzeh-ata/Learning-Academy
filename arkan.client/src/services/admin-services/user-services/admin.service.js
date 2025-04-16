import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@api/axios';

const API_PATH = '/Admins';

export const fetchAdmins = createAsyncThunk('admins/fetchAdmins', async () => {
  const response = await axios.get(API_PATH);
  return response?.data || [];
});

export const deleteAdmin = createAsyncThunk('admins/deleteAdmin', async (user) => {
  await axios.delete(`${API_PATH}/${user.id}`);
  return user.id;
});

/**
* @param Admin -- {
  "FirstName": string,
  "LastName": string",
  "Email": string,
  "Password": string",
  "PhoneNumber": string,
  "image": "string"
  "roles": {roleId: number}[]
}
 */
export const addAdmin = createAsyncThunk('admins/addAdmin', async (adminData) => {
  const response = await axios.post(API_PATH, constructAdminForm(adminData));
  return response.data;
});

/**
* @param Admin -- {
  "userId": string,
  "FirstName": string,
  "LastName": string",
  "Email": string,
  "username": string",
  "PhoneNumber": string,
  "image": "string",
  "roles": {roleId: number}[]
}
 */
export const updateAdminInfo = createAsyncThunk('admins/updateAdminInfo', async (adminData) => {
  const response = await axios.put(`/AdminInfo`, constructAdminForm(adminData));
  return response.data;
});

export const fetchAdminInfo = createAsyncThunk('admins/fetchAdminInfo', async (adminData) => {
  const response = await axios.get(`/AdminInfo/${adminData.id}`);
  return response.data;
});

/**
* @param Admin -- {
  "userId": string,
  "newPassword": string",
}
 */
export const adminChangePassword = createAsyncThunk('admins/change', async (adminData) => {
  const response = await axios.post(`${API_PATH}/Change-Password`, adminData);
  return response.data;
});

const constructAdminForm = (admin) => {
  const formData = new FormData();
  if (admin.id) {
    formData.append('id', admin.id);
  }
  if (admin.password) {
    formData.append('password', admin.password);
  }
  formData.append('firstName', admin.firstName);
  formData.append('lastName', admin.lastName);
  formData.append('email', admin.email);
  formData.append('phoneNumber', admin.phoneNumber);
  formData.append('image', admin.image);

  if (admin.roles?.length) {
    admin.roles.forEach((roleId, index) => {
      formData.append(`roles[${index}].roleId`, roleId.toString());
    });
  }

  formData.append('username', admin.email);

  return formData;
};
