import { createSlice } from '@reduxjs/toolkit';
import { deleteQuizAttempt, reviewQuiz, startQuizAttempt } from '@services/client-services/student-quiz.service';

const initialState = {
  data: {
    attempt: {
      questions: [],
      quizName: '',
      timeLimit: 0,
      lessonName: '',
      quizId: null,
      key: '',
      loading: false,
      error: null
    },
    review: {
      name: '',
      questions: [],
      quizTotalPoints: 0,
      timeTaken: '',
      studentMark: 0,
      id: null,
      key: '',
      loading: false,
      error: null
    }
  }
};

const lessonQuizSlice = createSlice({
  name: 'lessonQuiz',
  initialState,
  reducers: {
    resetAttempt: (state) => {
      state.data.attempt = initialState.data.attempt;
    },
    resetReview: (state) => {
      state.data.review = initialState.data.review;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(startQuizAttempt.pending, (state) => {
        state.data.attempt.loading = true;
      })
      .addCase(startQuizAttempt.fulfilled, (state, action) => {
        state.data.attempt = { ...action.payload };
        state.data.attempt.loading = false;
        state.data.attempt.error = null;
      })
      .addCase(startQuizAttempt.rejected, (state, action) => {
        state.data.attempt.loading = false;
        state.data.attempt.error = action.payload.key || action.error.message;
      })
      .addCase(reviewQuiz.pending, (state) => {
        state.data.review.loading = true;
      })
      .addCase(reviewQuiz.fulfilled, (state, action) => {
        state.data.review = { ...action.payload };
        state.data.review.loading = false;
        state.data.review.error = null;
      })
      .addCase(reviewQuiz.rejected, (state, action) => {
        state.data.review.loading = false;
        state.data.review.error = action.payload.key || action.error.message;
      })
      .addCase(deleteQuizAttempt.fulfilled, (state) => {
        state.data.review = { ...initialState.data.review };
        state.data.review.loading = false;
        state.data.review.error = null;
      });
  }
});

export const { resetAttempt, resetReview } = lessonQuizSlice.actions;
export const selectQuizAttempt = (state) => state.lessonQuiz.data.attempt;
export const selectQuizReview = (state) => state.lessonQuiz.data.review;

export const selectCourseProfileChapters = (state) => state.courseProfile.data.courseChapters;

export default lessonQuizSlice.reducer;
