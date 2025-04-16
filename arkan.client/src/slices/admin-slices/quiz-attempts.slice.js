import { createSlice } from '@reduxjs/toolkit';
import { getQuizStudentsAttempts } from '@services/admin-services/quiz-attempts.service';

const initialState = {
  items: [],
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
};

const QuizAttemptsSlice = createSlice({
  name: 'quizAttempts',
  initialState,
  reducers: {
    resetQuizState: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getQuizStudentsAttempts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getQuizStudentsAttempts.fulfilled, (state, action) => {
        state.items = action.payload.items;
        const { currentPage, pageSize, totalCount, totalPages, hasNextPage, hasPreviousPage } = action.payload;
        state.pagination = { currentPage, pageSize, totalCount, totalPages, hasNextPage, hasPreviousPage };
        state.loading = false;
      })
      .addCase(getQuizStudentsAttempts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  }
});
export const selectLoading = (state) => state.quizAttempts.loading;
export const selectPagination = (state) => state.quizAttempts.pagination;
export const selectQuizAttempts = (state) => state.quizAttempts.items;
export const { resetQuizState } = QuizAttemptsSlice.actions;

export default QuizAttemptsSlice.reducer;
