import axios from '@api/axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { logout } from '@services/auth/auth.service';

const API_PATH = '/UserProfile';
const PASSWORD_API_PATH = '/UserPassword';

export const getUserProfile = createAsyncThunk('users/getUserProfile', async (_, thunkAPI) => {
  try {
    const response = await axios.get(API_PATH);
    return response?.data;
  } catch (err) {
    thunkAPI.dispatch(logout());
    return null;
  }
});

export const updateUserProfile = createAsyncThunk('users/updateUserProfile', async (instructorData) => {
  const response = await axios.put(API_PATH, constructInstructorForm(instructorData));
  return response.data;
});

export const updateUserPassword = createAsyncThunk('users/changeUserPassword', async (passwordData) => {
  const response = await axios.post(PASSWORD_API_PATH, passwordData, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
});

const constructInstructorForm = (instructorData) => {
  const formData = new FormData();

  formData.append('firstName', instructorData.firstName ?? '');
  formData.append('lastName', instructorData.lastName ?? '');
  formData.append('email', instructorData.email ?? '');
  formData.append('phoneNumber', instructorData.phoneNumber ?? '');
  formData.append('image', instructorData.image);
  formData.append('birthDate', instructorData.birthDate ?? '');
  formData.append('sex', instructorData.sex ?? '');
  formData.append('bio', instructorData.bio ?? '');
  formData.append('specialization', instructorData.specialization ?? '');
  formData.append('linkedIn', instructorData.linkedIn ?? '');
  formData.append('university', instructorData.university ?? '');
  formData.append('showStudentsCount', Boolean(instructorData.showStudentsCount));

  formData.append('twitter', instructorData.twitter ?? '');
  formData.append('facebook', instructorData.facebook ?? '');
  formData.append('instagram', instructorData.instagram ?? '');
  formData.append('experience', instructorData.experience ?? '');
  formData.append('officeHours', instructorData.officeHours ?? '');
  formData.append('location', instructorData.location ?? '');

  return formData;
};
