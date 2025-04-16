import { createSlice } from '@reduxjs/toolkit';
import { fetchStudentInformation } from '@/services/admin-services/user-services';

const initialState = {
  byUserId: {},
  loading: false,
  error: null
};

const studentInfoSlice = createSlice({
  name: 'studentInfo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // get student info
      .addCase(fetchStudentInformation.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudentInformation.fulfilled, (state, action) => {
        const { userId } = action.payload;
        state.byUserId[userId] = action.payload;
        state.loading = false;
      })
      .addCase(fetchStudentInformation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  }
});

export const selectStudentInfoLoading = (state) => state.studentInfo.loading;
export const selectStudentInfo = (state) => state.studentInfo.StudentInfo;

export default studentInfoSlice.reducer;
