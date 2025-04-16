import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import {
  createChapter,
  deleteChapter,
  updateChapter,
  fetchChapters
} from '@/services/admin-services/course-management-services/chapters.service';

const chaptersAdapter = createEntityAdapter();

const initialState = chaptersAdapter.getInitialState({
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
});

const ChapterSlice = createSlice({
  name: 'chapters',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchChapters.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChapters.fulfilled, (state, action) => {
        chaptersAdapter.setAll(state, action.payload.items);
        const { currentPage, pageSize, totalCount, totalPages, hasNextPage, hasPreviousPage } = action.payload;
        state.pagination = { currentPage, pageSize, totalCount, totalPages, hasNextPage, hasPreviousPage };
        state.loading = false;
      })
      .addCase(fetchChapters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })

      // create Chapter
      .addCase(createChapter.pending, (state) => {
        state.loading = true;
      })
      .addCase(createChapter.fulfilled, (state, action) => {
        chaptersAdapter.addOne(state, action.payload.data);
        state.loading = false;
        state.error = null;
      })
      .addCase(createChapter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // delete Chapter
      .addCase(deleteChapter.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteChapter.fulfilled, (state, action) => {
        chaptersAdapter.removeOne(state, action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteChapter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // update Chapter
      .addCase(updateChapter.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateChapter.fulfilled, (state, action) => {
        chaptersAdapter.updateOne(state, { id: action.payload.data.id, changes: action.payload.data });
        state.loading = false;
        state.error = null;
      })
      .addCase(updateChapter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});
export const selectLoading = (state) => state.chapters.loading;
export const selectPaginationData = (state) => state.chapters.pagination;
export const {
  selectAll: selectAllChapters
  // Add more selectors if needed
} = chaptersAdapter.getSelectors((state) => state.chapters);
export default ChapterSlice.reducer;
