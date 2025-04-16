import axios from '@api/axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const API_PATH = '/QuizAttempt';

export const startQuizAttempt = createAsyncThunk('studentQuiz/startQuizAttempt', async (lessonId) => {
  const response = await axios.get(`${API_PATH}/${lessonId}`);
  return response?.data;
});

export const deleteQuizAttempt = createAsyncThunk('studentQuiz/deleteQuizAttempt', async (quizId) => {
  const response = await axios.delete(`${API_PATH}/${quizId}`);
  return response?.data;
});

/**
 * Submit Answer to each quiz Question
 *
 * @param {Object} answer - An object containing key-value pairs of answer data
 * @param {number} [answer.quizId] - The id for a course.
 * @param {number} [answer.questionId] - this id of questionId/
 * @param {number} [answer.answerId] - The id for a answer.
 * @returns {Promise<string>} A promise that resolves to the array of the fetched courses.
 */
export const submitAnswer = createAsyncThunk('studentQuiz/submitAnswer', async (answer) => {
  const response = await axios.post(`${API_PATH}/SubmitAnswer`, answer);
  return response?.data;
});

export const finishQuiz = createAsyncThunk('studentQuiz/finishQuiz', async (quizId) => {
  const response = await axios.post(`${API_PATH}/FinishQuiz?quizId=${quizId}`);
  return response?.data;
});

/*
   public class QuizReview
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public double QuizTotalPoints { get; set; }
        public double StudentMark { get; set; }
        public string TimeTaken { get; set; }
        public List<QuestionsReview> Questions { get; set; }
        public string Key { get; set; }
    }
*/
export const reviewQuiz = createAsyncThunk('studentQuiz/reviewQuiz', async (quizId) => {
  const response = await axios.get(`${API_PATH}/QuizReview?quizId=${quizId}`);
  return response?.data;
});
