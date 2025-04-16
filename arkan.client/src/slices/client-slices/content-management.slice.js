import { createSlice } from '@reduxjs/toolkit';
import {
  fetchHeroSection,
  fetchCoursesSection,
  fetchStatisticsSection,
  fetchUniversitiesSection,
  fetchInstructorsSection,
  fetchCompanyInfo,
  fetchCategoriesSection
} from '@services/client-services/content-management.service';

const initialState = {
  data: {
    heroContent: {
      description: '',
      headerText: '',
      id: null,
      image: '',
      loading: false,
      error: null
    },
    coursesContent: {
      courses: [],
      loading: false,
      error: null
    },
    statsContent: {
      instructorsCount: 0,
      studentsCount: 0,
      coursesCount: 0,
      videosCount: 0,
      loading: false,
      error: null
    },
    universitiesContent: {
      universities: [],
      loading: false,
      error: null
    },
    instructorsContent: {
      instructors: [],
      loading: false,
      error: null
    },
    companyInfo: {
      id: null,
      aboutUs: null,
      image: null,
      facebookUrl: null,
      instagramUrl: null,
      tikTokUrl: null,
      snapchatUrl: null,
      phonenumber: null,
      loading: false,
      error: null
    },
    categoriesContent: {
      categories: [],
      loading: false,
      error: null
    }
  },
  showFooter: true
};

const ContentManagementSlice = createSlice({
  name: 'contentManagement',
  initialState,
  reducers: {
    toggleFooter: (state, action) => {
      state.showFooter = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHeroSection.pending, (state) => {
        state.data.heroContent.loading = true;
      })
      .addCase(fetchHeroSection.fulfilled, (state, action) => {
        state.data.heroContent = { ...action.payload };
        state.data.heroContent.loading = false;
        state.data.heroContent.error = null;
      })
      .addCase(fetchHeroSection.rejected, (state, action) => {
        state.data.heroContent.loading = false;
        state.data.heroContent.error = action.error.message;
      })

      .addCase(fetchCoursesSection.pending, (state) => {
        state.data.coursesContent.loading = true;
      })
      .addCase(fetchCoursesSection.fulfilled, (state, action) => {
        state.data.coursesContent.courses = action.payload;
        state.data.coursesContent.loading = false;
        state.data.coursesContent.error = null;
      })
      .addCase(fetchCoursesSection.rejected, (state, action) => {
        state.data.coursesContent.loading = false;
        state.data.coursesContent.error = action.error.message;
      })
      .addCase(fetchStatisticsSection.pending, (state) => {
        state.data.statsContent.loading = true;
      })
      .addCase(fetchStatisticsSection.fulfilled, (state, action) => {
        state.data.statsContent = { ...action.payload };
        state.data.statsContent.loading = false;
        state.data.statsContent.error = null;
      })
      .addCase(fetchStatisticsSection.rejected, (state, action) => {
        state.data.statsContent.loading = false;
        state.data.statsContent.error = action.error.message;
      })

      .addCase(fetchUniversitiesSection.pending, (state) => {
        state.data.universitiesContent.loading = true;
      })
      .addCase(fetchUniversitiesSection.fulfilled, (state, action) => {
        state.data.universitiesContent.universities = action.payload;
        state.data.universitiesContent.loading = false;
        state.data.universitiesContent.error = null;
      })
      .addCase(fetchUniversitiesSection.rejected, (state, action) => {
        state.data.universitiesContent.loading = false;
        state.data.universitiesContent.error = action.error.message;
      })

      .addCase(fetchInstructorsSection.pending, (state) => {
        state.data.instructorsContent.loading = true;
      })
      .addCase(fetchInstructorsSection.fulfilled, (state, action) => {
        state.data.instructorsContent.instructors = action.payload;
        state.data.instructorsContent.loading = false;
        state.data.instructorsContent.error = null;
      })
      .addCase(fetchInstructorsSection.rejected, (state, action) => {
        state.data.instructorsContent.loading = false;
        state.data.instructorsContent.error = action.error.message;
      })
      .addCase(fetchCompanyInfo.pending, (state) => {
        state.data.companyInfo.loading = true;
      })
      .addCase(fetchCompanyInfo.fulfilled, (state, action) => {
        state.data.companyInfo = { ...action.payload };
        state.data.companyInfo.loading = false;
        state.data.companyInfo.error = null;
      })
      .addCase(fetchCompanyInfo.rejected, (state, action) => {
        state.data.companyInfo.loading = false;
        state.data.companyInfo.error = action.error.message;
      })
      .addCase(fetchCategoriesSection.pending, (state) => {
        state.data.categoriesContent.loading = true;
      })
      .addCase(fetchCategoriesSection.fulfilled, (state, action) => {
        state.data.categoriesContent.categories = action.payload;
        state.data.categoriesContent.loading = false;
        state.data.categoriesContent.error = null;
      })
      .addCase(fetchCategoriesSection.rejected, (state, action) => {
        state.data.categoriesContent.loading = false;
        state.data.categoriesContent.error = action.error.message;
      });
  }
});

export const selectInstructorsSection = (state) => state.contentManagement.data.instructorsContent;
export const selectUniversitiesSection = (state) => state.contentManagement.data.universitiesContent;
export const selectStatsSection = (state) => state.contentManagement.data.statsContent;
export const selectCoursesSection = (state) => state.contentManagement.data.coursesContent;
export const selectHeroSection = (state) => state.contentManagement.data.heroContent;
export const selectCompanyInfo = (state) => state.contentManagement.data.companyInfo;
export const selectCategoriesSection = (state) => state.contentManagement.data.categoriesContent;
export const selectContent = (state) => state.contentManagement.data;
export const isFooterVisible = (state) => state.contentManagement.showFooter;
export const { toggleFooter } = ContentManagementSlice.actions;
export default ContentManagementSlice.reducer;
