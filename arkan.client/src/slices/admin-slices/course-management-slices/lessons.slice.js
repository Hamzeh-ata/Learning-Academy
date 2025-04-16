import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import {
  createLesson,
  deleteLesson,
  updateLesson,
  fetchLessons
} from '@/services/admin-services/course-management-services/lessons.service';

const lessonsAdapter = createEntityAdapter();

const initialState = lessonsAdapter.getInitialState({
  loading: false,
  error: null
});

const LessonSlice = createSlice({
  name: 'lessons',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchLessons.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLessons.fulfilled, (state, action) => {
        lessonsAdapter.setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(fetchLessons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })

      // create Lesson
      .addCase(createLesson.pending, (state) => {
        state.loading = true;
      })
      .addCase(createLesson.fulfilled, (state, action) => {
        lessonsAdapter.addOne(state, action.payload.data);
        state.loading = false;
        state.error = null;
      })
      .addCase(createLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // delete Lesson
      .addCase(deleteLesson.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteLesson.fulfilled, (state, action) => {
        lessonsAdapter.removeOne(state, action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // update Lesson
      .addCase(updateLesson.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateLesson.fulfilled, (state, action) => {
        lessonsAdapter.updateOne(state, { id: action.payload.data.id, changes: action.payload.data });
        state.loading = false;
        state.error = null;
      })
      .addCase(updateLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});
export const selectLoading = (state) => state.lessons.loading;
export const {
  selectAll: selectAllLessons
  // Add more selectors if needed
} = lessonsAdapter.getSelectors((state) => state.lessons);
export default LessonSlice.reducer;
