import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@api/axios';
import { constructFormData } from '@/api/utils';

const API_ENDPOINTS = {
  HERO: '/HeroSection',
  COURSES: '/CoursesSection',
  CATEGORIES: '/CategoriesSection',
  INSTRUCTORS: '/InstructorsSection',
  UNIVERSITIES: '/UniversitiesSection',
  COMPANY_INFO: '/CompanyInfo'
};

const SLICE_NAME = 'adminContentManagement';

const createCRUDThunks = (entity, endpoint) => ({
  get: createAsyncThunk(`${entity}/get`, async () => {
    const response = await axios.get(endpoint);
    return response?.data;
  }),
  create: createAsyncThunk(`${entity}/create`, async (data) => {
    const response = await axios.post(endpoint, constructFormData(data));
    return response?.data;
  }),
  update: createAsyncThunk(`${entity}/update`, async (data) => {
    const response = await axios.put(endpoint, constructFormData(data));
    return response?.data;
  }),
  delete: createAsyncThunk(`${entity}/delete`, async (id) => {
    await axios.delete(`${endpoint}?itemId=${id}`);
    return id;
  })
});

const createThunks = (sliceName, endpoints) =>
  Object.values(endpoints).map((endpoint) => createCRUDThunks(`${sliceName}/${endpoint}`, endpoint));

const [
  heroThunks,
  coursesSectionThunks,
  categoriesSectionThunks,
  instructorsSectionThunks,
  universitiesSectionThunks,
  companyInfoThunks
] = createThunks(SLICE_NAME, API_ENDPOINTS);

export {
  heroThunks,
  coursesSectionThunks,
  categoriesSectionThunks,
  instructorsSectionThunks,
  universitiesSectionThunks,
  companyInfoThunks
};
