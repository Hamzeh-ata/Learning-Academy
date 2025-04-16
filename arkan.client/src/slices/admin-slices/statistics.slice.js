import {
  courseStatisticsThunks,
  instructorStatisticsThunks,
  ordersStatisticsThunks,
  statisticsThunks,
  studentStatisticsThunks
} from '@/services/admin-services/statistics.service';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  statistics: {
    studentsCount: null,
    coursesCount: null,
    instructorsCount: null,
    loading: false,
    error: null
  },
  courseStatistics: {
    studentsCount: null,
    chaptersCount: null,
    loading: false,
    error: null,
    lessonsCount: null,
    quizzesCount: null
  },
  instructorStatistics: {
    studentsCount: null,
    coursesCount: null,
    lessonsCount: null,
    loading: false,
    error: null
  },
  studentStatistics: {
    coursesCount: null,
    payments: null,
    loading: false,
    error: null,
    quizAttemptsCount: null,
    quizzesAverageMark: null,
    completedLessonsCount: null
  },
  ordersStatistics: {
    orders: [],
    loading: false,
    error: null
  }
};

const statisticsSlice = createSlice({
  name: 'adminStatistics',
  initialState,
  extraReducers: (builder) => {
    builder
      // statisticsThunks
      .addCase(statisticsThunks.get.pending, (state) => {
        state.statistics.loading = true;
      })
      .addCase(statisticsThunks.get.fulfilled, (state, action) => {
        state.statistics = { ...action.payload };
        state.statistics.loading = false;
        state.statistics.error = null;
      })
      .addCase(statisticsThunks.get.rejected, (state, action) => {
        state.statistics.loading = false;
        state.statistics.error = action.error.message;
      })

      // courseStatistics
      .addCase(courseStatisticsThunks.getById.pending, (state) => {
        state.courseStatistics.loading = true;
      })
      .addCase(courseStatisticsThunks.getById.fulfilled, (state, action) => {
        state.courseStatistics = { ...action.payload };
        state.courseStatistics.loading = false;
        state.courseStatistics.error = null;
      })
      .addCase(courseStatisticsThunks.getById.rejected, (state, action) => {
        state.courseStatistics.loading = false;
        state.courseStatistics.error = action.error.message;
      })

      // instructorStatisticsThunks
      .addCase(instructorStatisticsThunks.getById.pending, (state) => {
        state.instructorStatistics.loading = true;
      })
      .addCase(instructorStatisticsThunks.getById.fulfilled, (state, action) => {
        state.instructorStatistics = { ...action.payload };
        state.instructorStatistics.loading = false;
        state.instructorStatistics.error = null;
      })
      .addCase(instructorStatisticsThunks.getById.rejected, (state, action) => {
        state.instructorStatistics.loading = false;
        state.instructorStatistics.error = action.error.message;
      })

      // studentStatisticsThunks
      .addCase(studentStatisticsThunks.getById.pending, (state) => {
        state.studentStatistics.loading = true;
      })
      .addCase(studentStatisticsThunks.getById.fulfilled, (state, action) => {
        state.studentStatistics = { ...action.payload };
        state.studentStatistics.loading = false;
        state.studentStatistics.error = null;
      })
      .addCase(studentStatisticsThunks.getById.rejected, (state, action) => {
        state.studentStatistics.loading = false;
        state.studentStatistics.error = action.error.message;
      })

      // ordersStatisticsThunks
      .addCase(ordersStatisticsThunks.getByDateRange.pending, (state) => {
        state.ordersStatistics.loading = true;
      })
      .addCase(ordersStatisticsThunks.getByDateRange.fulfilled, (state, action) => {
        state.ordersStatistics.orders = action.payload;
        state.ordersStatistics.loading = false;
        state.ordersStatistics.error = null;
      })
      .addCase(ordersStatisticsThunks.getByDateRange.rejected, (state, action) => {
        state.ordersStatistics.loading = false;
        state.ordersStatistics.error = action.error.message;
      });
  }
});

export const selectStatistics = (state) => state.adminStatistics.statistics;
export const selectCourseStatistics = (state) => state.adminStatistics.courseStatistics;
export const selectInstructorStatistics = (state) => state.adminStatistics.instructorStatistics;
export const selectStudentStatistics = (state) => state.adminStatistics.studentStatistics;
export const selectOrdersStatistics = (state) => state.adminStatistics.ordersStatistics;

export default statisticsSlice.reducer;
