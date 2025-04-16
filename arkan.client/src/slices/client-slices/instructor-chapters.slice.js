import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import {
  chaptersThunks,
  fetchCourseChapters,
  lessonsThunks
} from '@services/client-services/instructor-course-profile.service';

const chaptersAdapter = createEntityAdapter();
const initialState = chaptersAdapter.getInitialState({
  loading: false,
  error: null
});

const InstructorChaptersSlice = createSlice({
  name: 'instructorChapters',
  initialState,
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.loading = true;
    };
    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    };

    builder
      .addCase(fetchCourseChapters.pending, handlePending)
      .addCase(fetchCourseChapters.fulfilled, (state, action) => {
        chaptersAdapter.setAll(state, action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchCourseChapters.rejected, handleRejected)
      .addCase(chaptersThunks.create.pending, handlePending)
      .addCase(chaptersThunks.create.fulfilled, (state, action) => {
        chaptersAdapter.addOne(state, action.payload);
      })
      .addCase(chaptersThunks.create.rejected, handleRejected)
      .addCase(chaptersThunks.update.pending, handlePending)
      .addCase(chaptersThunks.update.fulfilled, (state, action) => {
        chaptersAdapter.updateOne(state, { id: action.payload.id, changes: action.payload });
      })
      .addCase(chaptersThunks.update.rejected, handleRejected)
      .addCase(chaptersThunks.delete.pending, handlePending)
      .addCase(chaptersThunks.delete.fulfilled, (state, action) => {
        chaptersAdapter.removeOne(state, action.payload);
      })
      .addCase(chaptersThunks.delete.rejected, handleRejected)

      .addCase(lessonsThunks.create.fulfilled, (state, action) => {
        const { chapterId, ...rest } = action.payload;
        if (state.entities[chapterId]?.lessons) {
          chaptersAdapter.updateOne(state, {
            id: chapterId,
            changes: {
              lessons: [...state.entities[chapterId].lessons, rest]
            }
          });
        } else {
          chaptersAdapter.updateOne(state, {
            id: chapterId,
            changes: {
              lessons: [rest]
            }
          });
        }
      })

      .addCase(lessonsThunks.update.fulfilled, (state, action) => {
        const { meta, payload: lesson } = action;
        const chapterId = meta.arg.chapterId;
        chaptersAdapter.updateOne(state, {
          id: chapterId,
          changes: {
            lessons: state.entities[chapterId]?.lessons?.map((l) => (l.id === lesson.id ? { ...l, ...lesson } : l))
          }
        });
      })
      .addCase(lessonsThunks.delete.fulfilled, (state, action) => {
        const lessonId = action.payload;
        Object.entries(state.entities).forEach(([id, chapter]) => {
          if (chapter.lessons.some((lesson) => lesson.id === lessonId)) {
            chaptersAdapter.updateOne(state, {
              id,
              changes: {
                lessons: chapter.lessons.filter((lesson) => lesson.id !== lessonId)
              }
            });
          }
        });
      });
  }
});

export const { selectAll: selectAllChapters } = chaptersAdapter.getSelectors((state) => state.instructorChapters);
export default InstructorChaptersSlice.reducer;
