import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@api/axios';

const HERO_API_PATH = '/HeroSection';
const COURSES_API_PATH = '/CoursesSection';
const STATS_API_PATH = '/Stats';
const UNIVERSITIES_API_PATH = '/UniversitiesSection';
const INSTRUCTORS_API_PATH = '/InstructorsSection';
const COMPANY_INFO_API_PATH = '/CompanyInfo';
const CATEGORIES_API_PATH = '/CategoriesSection';

export const fetchHeroSection = createAsyncThunk('contentManagement/fetchHeroSection', async () => {
  const response = await axios.get(HERO_API_PATH);
  return response?.data;
});

export const fetchCoursesSection = createAsyncThunk('contentManagement/fetchCoursesSection', async () => {
  const response = await axios.get(COURSES_API_PATH);
  return response?.data || [];
});

export const fetchStatisticsSection = createAsyncThunk('contentManagement/fetchStatisticsSection', async () => {
  const response = await axios.get(STATS_API_PATH);
  return response?.data;
});

export const fetchUniversitiesSection = createAsyncThunk('contentManagement/fetchUniversitiesSection', async () => {
  const response = await axios.get(UNIVERSITIES_API_PATH);
  return response?.data || [];
});

export const fetchCategoriesSection = createAsyncThunk('contentManagement/fetchCategoriesSection', async () => {
  const response = await axios.get(CATEGORIES_API_PATH);
  return response?.data || [];
});

export const fetchInstructorsSection = createAsyncThunk('contentManagement/fetchInstructorsSection', async () => {
  const response = await axios.get(INSTRUCTORS_API_PATH);
  return response?.data || [];
});

export const fetchCompanyInfo = createAsyncThunk('contentManagement/fetchCompanyInfo', async () => {
  const response = await axios.get(COMPANY_INFO_API_PATH);
  return response?.data;
});
