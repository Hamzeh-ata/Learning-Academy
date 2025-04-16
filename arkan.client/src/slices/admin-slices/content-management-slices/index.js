import { combineReducers } from '@reduxjs/toolkit';
import heroSectionSlice from './hero-section.slice';
import coursesSectionSlice from './courses-section.slice';
import instructorsSectionSlice from './instructors-section.slice';
import universitiesSectionSlice from './universities-section.slice';
import companyInfoSectionSlice from './company-info-section.slice';
import categorySectionSlice from './categories-section.slice';

const adminContentManagementReducer = combineReducers({
  coursesSection: coursesSectionSlice,
  heroSection: heroSectionSlice,
  instructorsSection: instructorsSectionSlice,
  universitiesSection: universitiesSectionSlice,
  companyInfoSection: companyInfoSectionSlice,
  categoriesSection: categorySectionSlice
});

export default adminContentManagementReducer;
