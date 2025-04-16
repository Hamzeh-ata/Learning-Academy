import { createSlice } from '@reduxjs/toolkit';
import { getUserProfile, updateUserProfile } from '@services/client-services/user-profile.service';

const initialState = {
  data: {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    image: null,
    birthDate: '',
    sex: '',
    university: null,
    specialization: '',
    bio: '',
    linkedIn: '',
    twitter: '',
    facebook: '',
    instagram: '',
    experience: '',
    officeHours: '',
    location: null,
    key: '',
    loading: false,
    error: null
  }
};

const UserProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfile.pending, (state) => {
        state.data.loading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.data = { ...action.payload };
        state.data.loading = false;
        state.data.error = null;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.data.loading = false;
        state.data.error = action.error.message;
      })

      .addCase(updateUserProfile.pending, (state) => {
        state.data.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.data = { ...action.payload };
        state.data.loading = false;
        state.data.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.data.loading = false;
        state.data.error = action.error.message;
      });
  }
});

export const selectUserProfile = (state) => state.userProfile.data;

export default UserProfileSlice.reducer;
