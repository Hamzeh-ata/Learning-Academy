import { createSlice } from '@reduxjs/toolkit';
import {
  answersThunks,
  questionsThunks,
  quizzesThunks
} from '@services/client-services/instructor-course-profile.service';

const initialState = {
  quiz: null,
  loading: false,
  error: null
};

const instructorQuizSlice = createSlice({
  name: 'instructorQuiz',
  initialState,
  reducers: {
    resetQuiz: (state) => {
      state.quiz = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // create Quiz
      .addCase(quizzesThunks.create.pending, (state) => {
        state.loading = true;
      })
      .addCase(quizzesThunks.create.fulfilled, (state, action) => {
        state.quiz = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(quizzesThunks.create.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // delete Quiz
      .addCase(quizzesThunks.delete.pending, (state) => {
        state.loading = true;
      })
      .addCase(quizzesThunks.delete.fulfilled, (state) => {
        state.quiz = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(quizzesThunks.delete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // update Quiz
      .addCase(quizzesThunks.update.pending, (state) => {
        state.loading = true;
      })
      .addCase(quizzesThunks.update.fulfilled, (state, action) => {
        const data = { ...state.quiz, ...action.payload };
        state.quiz = data;
        state.loading = false;
        state.error = null;
      })
      .addCase(quizzesThunks.update.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // get Quiz
      .addCase(quizzesThunks.get.pending, (state) => {
        state.loading = true;
      })
      .addCase(quizzesThunks.get.fulfilled, (state, action) => {
        state.quiz = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(quizzesThunks.get.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //* Delete Question
      .addCase(questionsThunks.delete.pending, (state) => {
        state.loading = true;
      })
      .addCase(questionsThunks.delete.fulfilled, (state, action) => {
        const questionId = action.meta.arg;
        if (state.quiz && state.quiz.questions) {
          state.quiz.questions = state.quiz.questions.filter((question) => question.id !== questionId);
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(questionsThunks.delete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //* Update Question
      .addCase(questionsThunks.update.pending, (state) => {
        state.loading = true;
      })
      .addCase(questionsThunks.update.fulfilled, (state, action) => {
        const updatedQuestion = action.payload;
        if (state.quiz && state.quiz.questions) {
          const index = state.quiz.questions.findIndex((question) => question.id === updatedQuestion.id);
          if (index !== -1) {
            state.quiz.questions[index] = { ...state.quiz.questions[index], ...updatedQuestion };
          }
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(questionsThunks.update.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //* Create Question
      .addCase(questionsThunks.create.pending, (state) => {
        state.loading = true;
      })
      .addCase(questionsThunks.create.fulfilled, (state, action) => {
        const newQuestion = action.payload;
        if (state.quiz && state.quiz.questions) {
          state.quiz.questions.push(newQuestion);
        } else if (state.quiz) {
          state.quiz.questions = [newQuestion];
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(questionsThunks.create.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //* Create Answer
      .addCase(answersThunks.create.pending, (state) => {
        state.loading = true;
      })
      .addCase(answersThunks.create.fulfilled, (state, action) => {
        const answer = action.payload;
        const questionId = action.meta.arg.questionId;
        const question = state.quiz.questions.find((q) => q.id === questionId);

        if (question) {
          if (question.answers) {
            question.answers.push(answer);
          } else {
            question.answers = [answer];
          }
        }

        state.loading = false;
        state.error = null;
      })
      .addCase(answersThunks.create.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      //* Update Answer
      .addCase(answersThunks.update.pending, (state) => {
        state.loading = true;
      })
      .addCase(answersThunks.update.fulfilled, (state, action) => {
        const answer = action.payload;
        const questionId = action.meta.arg.questionId;
        const question = state.quiz.questions.find((q) => q.id === questionId);
        if (question && question.answers) {
          const index = question.answers.findIndex((a) => a.id === answer.id);
          if (index !== -1) {
            question.answers[index] = answer; // Update the answer
          }
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(answersThunks.update.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      //* delete Answer
      .addCase(answersThunks.delete.pending, (state) => {
        state.loading = true;
      })
      .addCase(answersThunks.delete.fulfilled, (state, action) => {
        const answerId = action.meta.arg;

        const question = state.quiz.questions.find((e) => e.answers.find((d) => d.id === answerId));
        if (question && question.answers) {
          question.answers = question.answers.filter((a) => a.id !== answerId); // Remove the answer
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(answersThunks.delete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});
export const selectLoading = (state) => state.instructorQuiz.loading;
export const selectInstructorQuiz = (state) => state.instructorQuiz.quiz;
export const { resetQuiz } = instructorQuizSlice.actions;

export default instructorQuizSlice.reducer;
