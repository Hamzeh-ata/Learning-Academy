import { createSlice } from '@reduxjs/toolkit';
import { completeLesson, fetchCourseById, fetchCourseChapters } from '@services/client-services/course-profile.service';

const initialState = {
  data: {
    course: {
      id: null,
      name: '',
      description: '',
      instructorName: '',
      instructorImage: '',
      price: null,
      discountPrice: 0,
      directPrice: 0,
      image: '',
      lessonsCount: null,
      videoOverView: null,
      imageOverView: '',
      editAble: false,
      isEnroll: false,
      isInCart: false,
      universities: [],
      categories: [],
      isPending: false,
      key: '',
      loading: false,
      error: null
    },
    courseChapters: {
      chapters: [],
      loading: false,
      error: null
    }
  }
};

const CourseProfileSlice = createSlice({
  name: 'courseProfile',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourseById.pending, (state) => {
        state.data.course.loading = true;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.data.course = { ...action.payload };
        state.data.course.loading = false;
        state.data.course.error = null;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.data.course.loading = false;
        state.data.course.error = action.error.message;
      })
      .addCase(fetchCourseChapters.pending, (state) => {
        state.data.courseChapters.loading = true;
      })
      .addCase(fetchCourseChapters.fulfilled, (state, action) => {
        state.data.courseChapters.chapters = action.payload;
        state.data.courseChapters.loading = false;
        state.data.courseChapters.error = null;
      })
      .addCase(fetchCourseChapters.rejected, (state, action) => {
        state.data.courseChapters.loading = false;
        state.data.courseChapters.error = action.error.message;
      })
      .addCase(completeLesson.pending, (state) => {
        state.data.courseChapters.loading = true;
      })
      .addCase(completeLesson.fulfilled, (state, action) => {
        const lessonId = action.payload;

        state.data.courseChapters.chapters.forEach((chapter) => {
          chapter.lessons.forEach((lesson) => {
            if (lesson.id === lessonId) {
              lesson.isCompleted = true;
            }
          });
        });
        state.data.courseChapters.loading = false;
        state.data.courseChapters.error = null;
      })
      .addCase(completeLesson.rejected, (state) => {
        state.data.courseChapters.loading = false;
        state.data.courseChapters.error = 'Failed to Complete the Lesson';
      });
  }
});

export const selectCourseProfile = (state) => state.courseProfile.data.course;
export const selectCourseProfileChapters = (state) => state.courseProfile.data.courseChapters;

export default CourseProfileSlice.reducer;
