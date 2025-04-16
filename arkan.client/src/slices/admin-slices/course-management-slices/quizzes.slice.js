import { createSlice } from '@reduxjs/toolkit';
import {
  createQuiz,
  deleteQuiz,
  updateQuiz,
  getQuizByLessonId
} from '@/services/admin-services/course-management-services/quizzes.service';
import {
  deleteQuestion,
  createQuestion,
  updateQuestion
} from '@/services/admin-services/course-management-services/questions.service';
import {
  createAnswer,
  deleteAnswer,
  updateAnswer
} from '@/services/admin-services/course-management-services/answers.service';

const initialState = {
  quiz: {
    questions: []
  },
  loading: false,
  error: null
};

const QuizSlice = createSlice({
  name: 'quizzes',
  initialState,
  extraReducers: (builder) => {
    builder
      // create Quiz
      .addCase(createQuiz.pending, (state) => {
        state.loading = true;
      })
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.quiz = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(createQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // delete Quiz
      .addCase(deleteQuiz.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteQuiz.fulfilled, (state) => {
        state.quiz = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // update Quiz
      .addCase(updateQuiz.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateQuiz.fulfilled, (state, action) => {
        const data = { ...state.quiz, ...action.payload.data };
        state.quiz = data;
        state.loading = false;
        state.error = null;
      })
      .addCase(updateQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(getQuizByLessonId.pending, (state) => {
        state.loading = true;
      })
      .addCase(getQuizByLessonId.fulfilled, (state, action) => {
        state.quiz = action.payload.data;
        state.loading = false;
        state.error = null;
      })
      .addCase(getQuizByLessonId.rejected, (state, action) => {
        state.loading = false;
        state.quiz = null;
        state.error = action.error.message;
      })

      //* Delete Question
      .addCase(deleteQuestion.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        const questionId = action.meta.arg.id;
        if (state.quiz && state.quiz.questions) {
          state.quiz.questions = state.quiz.questions.filter((question) => question.id !== questionId);
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //* Update Question
      .addCase(updateQuestion.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        const updatedQuestion = action.payload.data;
        if (state.quiz && state.quiz.questions) {
          const index = state.quiz.questions.findIndex((question) => question.id === updatedQuestion.id);
          if (index !== -1) {
            state.quiz.questions[index] = { ...state.quiz.questions[index], ...updatedQuestion };
          }
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(updateQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //* Create Question
      .addCase(createQuestion.pending, (state) => {
        state.loading = true;
      })
      .addCase(createQuestion.fulfilled, (state, action) => {
        const newQuestion = action.payload.data;
        if (state.quiz && state.quiz.questions) {
          state.quiz.questions.push(newQuestion);
        } else if (state.quiz) {
          state.quiz.questions = [newQuestion];
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(createQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //* Create Answer
      .addCase(createAnswer.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAnswer.fulfilled, (state, action) => {
        const answer = action.payload.data;
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
      .addCase(createAnswer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      //* Update Answer
      .addCase(updateAnswer.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAnswer.fulfilled, (state, action) => {
        const answer = action.payload.data;
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
      .addCase(updateAnswer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      //* delete Answer
      .addCase(deleteAnswer.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAnswer.fulfilled, (state, action) => {
        const questionId = action.meta.arg.questionId;
        const answerId = action.meta.arg.answer.id;

        const question = state.quiz.questions.find((q) => q.id === questionId);
        if (question && question.answers) {
          question.answers = question.answers.filter((a) => a.id !== answerId); // Remove the answer
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteAnswer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});
export const selectLoading = (state) => state.quizzes.loading;
export const selectQuiz = (state) => state.quizzes.quiz;

export default QuizSlice.reducer;
