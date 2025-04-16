import { createSlice } from '@reduxjs/toolkit';
import { getInstructorsByFilters, getPublicProfile } from '@services/client-services/instructor.service';

const initialState = {
  data: {
    profile: {
      id: null,
      name: '',
      phone: '',
      email: '',
      image: null,
      sex: null,
      university: null,
      specialty: '',
      bio: null,
      linkedIn: '',
      twitter: '',
      facebook: '',
      instagram: '',
      experience: '',
      officeHours: '',
      courses: [],
      lessonsCount: 0,
      coursesCount: 0,
      location: '',
      showStudentsCount: false,
      studentsCount: 0,
      key: '',
      loading: false,
      error: null
    },
    list: {
      items: [],
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
    }
  }
};

const InstructorSlice = createSlice({
  name: 'clientInstructors',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getPublicProfile.pending, (state) => {
        state.data.profile.loading = true;
      })
      .addCase(getPublicProfile.fulfilled, (state, action) => {
        state.data.profile = { ...action.payload };
        state.data.profile.loading = false;
        state.data.profile.error = null;
      })
      .addCase(getPublicProfile.rejected, (state, action) => {
        state.data.profile.loading = false;
        state.data.profile.error = action.error.message;
      })
      .addCase(getInstructorsByFilters.pending, (state) => {
        state.data.list.loading = true;
        state.data.list.error = null;
      })
      .addCase(getInstructorsByFilters.fulfilled, (state, action) => {
        state.data.list.items = action.payload.items;
        const { currentPage, pageSize, totalCount, totalPages, hasNextPage, hasPreviousPage } = action.payload;
        state.data.list.pagination = { currentPage, pageSize, totalCount, totalPages, hasNextPage, hasPreviousPage };

        state.data.list.loading = false;
      })
      .addCase(getInstructorsByFilters.rejected, (state, action) => {
        state.data.list.loading = false;
        state.data.list.error = action.payload || 'Failed to fetch instructors';
      });
  }
});

export const selectInstructorProfile = (state) => state.clientInstructors.data.profile;
export const selectClientInstructors = (state) => state.clientInstructors.data.list.items;
export const selectPaginationData = (state) => state.clientInstructors.data.list.pagination;
export const selectLoader = (state) => state.clientInstructors.data.list.loading;

export default InstructorSlice.reducer;
