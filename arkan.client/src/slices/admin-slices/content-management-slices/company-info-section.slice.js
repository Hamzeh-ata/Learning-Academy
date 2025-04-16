import { companyInfoThunks } from '@/services/admin-services/admin-content-management.service';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {
    id: null,
    aboutUs: null,
    image: null,
    facebookUrl: null,
    instagramUrl: null,
    tikTokUrl: null,
    snapchatUrl: null,
    phonenumber: null,
    loading: false,
    error: null
  }
};

const companyInfoSlice = createSlice({
  name: 'adminContentManagement/companyInfoSection',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(companyInfoThunks.get.pending, (state) => {
        state.data.loading = true;
      })
      .addCase(companyInfoThunks.get.fulfilled, (state, action) => {
        state.data = { ...action.payload };
        state.data.loading = false;
        state.data.error = null;
      })
      .addCase(companyInfoThunks.get.rejected, (state, action) => {
        state.data.loading = false;
        state.data.error = action.error.message;
      })

      .addCase(companyInfoThunks.update.pending, (state) => {
        state.data.loading = true;
      })
      .addCase(companyInfoThunks.update.fulfilled, (state, action) => {
        state.data = { ...action.payload };
        state.data.loading = false;
        state.data.error = null;
      })
      .addCase(companyInfoThunks.update.rejected, (state, action) => {
        state.data.loading = false;
        state.data.error = action.error.message;
      })

      .addCase(companyInfoThunks.create.pending, (state) => {
        state.data.loading = true;
      })
      .addCase(companyInfoThunks.create.fulfilled, (state, action) => {
        state.data = { ...action.payload };
        state.data.loading = false;
        state.data.error = null;
      })
      .addCase(companyInfoThunks.create.rejected, (state, action) => {
        state.data.loading = false;
        state.data.error = action.error.message;
      });
  }
});

export const selectCompanyInfo = (state) => state.adminContentManagement.companyInfoSection.data;

export default companyInfoSlice.reducer;
