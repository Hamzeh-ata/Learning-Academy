import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

import {
  fetchStudents,
  deleteStudent,
  updateStudentInfo,
  addStudentInformation,
  deleteStudentCourses
} from '@/services/admin-services/user-services';

const studentsAdapter = createEntityAdapter();

const initialState = studentsAdapter.getInitialState({
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1
  }
});

const StudentsSlice = createSlice({
  name: 'students',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        studentsAdapter.setAll(state, action.payload.items);
        const { currentPage, pageSize, totalCount, totalPages, hasNextPage, hasPreviousPage } = action.payload;
        state.pagination = { currentPage, pageSize, totalCount, totalPages, hasNextPage, hasPreviousPage };
        state.loading = false;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      //Add student
      .addCase(addStudentInformation.pending, (state) => {
        state.loading = true;
      })
      .addCase(addStudentInformation.fulfilled, (state, action) => {
        studentsAdapter.addOne(state, action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(addStudentInformation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // delete Student
      .addCase(deleteStudent.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        studentsAdapter.removeOne(state, action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // update student
      .addCase(updateStudentInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateStudentInfo.fulfilled, (state, action) => {
        action.payload.id = action.payload.userId;
        studentsAdapter.updateOne(state, { id: action.payload.id, changes: action.payload });
        state.loading = false;
        state.error = null;
      })
      .addCase(updateStudentInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteStudentCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteStudentCourses.fulfilled, (state, action) => {
        studentsAdapter.removeOne(state, action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteStudentCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const selectStudentsLoading = (state) => state.students.loading;
export const selectStudentsPaginationData = (state) => state.students.pagination;

export const {
  selectAll: selectAllStudents
  // Add more selectors if needed
} = studentsAdapter.getSelectors((state) => state.students);
export default StudentsSlice.reducer;
