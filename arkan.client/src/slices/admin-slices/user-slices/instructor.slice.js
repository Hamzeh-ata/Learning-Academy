import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import {
  fetchInstructors,
  deleteInstructor,
  fetchInstructorInformation,
  addInstructorInformation,
  updateInstructorInfo
} from '@/services/admin-services/user-services';

const instructorsAdapter = createEntityAdapter();

const initialState = instructorsAdapter.getInitialState({
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
});

const InstructorsSlice = createSlice({
  name: 'instructors',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchInstructors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInstructors.fulfilled, (state, action) => {
        instructorsAdapter.setAll(state, action.payload.items);
        const { currentPage, pageSize, totalCount, totalPages, hasNextPage, hasPreviousPage } = action.payload;
        state.pagination = { currentPage, pageSize, totalCount, totalPages, hasNextPage, hasPreviousPage };

        state.loading = false;
      })
      .addCase(fetchInstructors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })

      .addCase(deleteInstructor.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteInstructor.fulfilled, (state, action) => {
        instructorsAdapter.removeOne(state, action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteInstructor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchInstructorInformation.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInstructorInformation.fulfilled, (state, action) => {
        action.payload.id = action.payload.userId;
        instructorsAdapter.updateOne(state, { id: action.payload.userId, changes: action.payload });
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchInstructorInformation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(addInstructorInformation.pending, (state) => {
        state.loading = true;
      })
      .addCase(addInstructorInformation.fulfilled, (state, action) => {
        action.payload.id = action.payload.userId;
        instructorsAdapter.upsertOne(state, action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(addInstructorInformation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateInstructorInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateInstructorInfo.fulfilled, (state, action) => {
        action.payload.id = action.payload.userId;
        instructorsAdapter.updateOne(state, { id: action.payload.userId, changes: action.payload });
        state.loading = false;
        state.error = null;
      })
      .addCase(updateInstructorInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});
export const selectInstructorsLoading = (state) => state.instructors.loading;
export const selectInstructorsPaginationData = (state) => state.instructors.pagination;
export const {
  selectAll: selectAllInstructors
  // Add more selectors if needed
} = instructorsAdapter.getSelectors((state) => state.instructors);
export default InstructorsSlice.reducer;
