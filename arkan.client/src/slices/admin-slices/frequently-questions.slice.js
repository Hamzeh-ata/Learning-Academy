import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import {
  addQuestion,
  updateQuestion,
  deleteQuestion,
  getAllQuestions,
  getQuestionById
} from '@/services/admin-services/frequently-questions.service';

const frequentlyQuestionsAdapter = createEntityAdapter();

const initialState = frequentlyQuestionsAdapter.getInitialState({
  loading: false,
  error: null
});

const frequentlyQuestionsSlice = createSlice({
  name: 'frequentlyQuestions',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getAllQuestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllQuestions.fulfilled, (state, action) => {
        frequentlyQuestionsAdapter.setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getAllQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(addQuestion.pending, (state) => {
        state.loading = true;
      })
      .addCase(addQuestion.fulfilled, (state, action) => {
        frequentlyQuestionsAdapter.addOne(state, action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(addQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateQuestion.pending, (state) => {
        state.loading = true;
      })

      .addCase(updateQuestion.fulfilled, (state, action) => {
        frequentlyQuestionsAdapter.updateOne(state, { id: action.payload.id, changes: action.payload });
        state.loading = false;
        state.error = null;
      })

      .addCase(updateQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(deleteQuestion.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        frequentlyQuestionsAdapter.removeOne(state, action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(getQuestionById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getQuestionById.fulfilled, (state, action) => {
        frequentlyQuestionsAdapter.upsertOne(state, action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(getQuestionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const selectLoading = (state) => state.frequentlyQuestions.loading;
export const { selectAll: selectAllFrequentlyQuestions } = frequentlyQuestionsAdapter.getSelectors(
  (state) => state.frequentlyQuestions
);
export default frequentlyQuestionsSlice.reducer;
