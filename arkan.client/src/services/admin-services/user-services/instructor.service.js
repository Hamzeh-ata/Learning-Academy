import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@api/axios';

const API_PATH = '/Instructor';
const INSTRUCTOR_INFO_PATH = `${API_PATH}Info`;
const INSTRUCTOR_COURSES_PATH = `${API_PATH}Courses`;

export const fetchInstructors = createAsyncThunk(
  'instructor/fetchInstructors',
  async ({ currentPage = 1, pageSize = 10 }) => {
    const response = await axios.get(`${API_PATH}?pageNumber=${currentPage}&pageSize=${pageSize}`);
    return response.data || [];
  }
);

export const deleteInstructor = createAsyncThunk('instructors/deleteSInstructor', async (user) => {
  await axios.delete(`${API_PATH}/${user.id}`);
  return user.id;
});

/**
 * @param instructorInfo -- {userId: string, newPassword: string}
 */
export const instructorChangePassword = createAsyncThunk('instructors/changePassword', async (instructorData) => {
  const response = await axios.post(`${API_PATH}/Change-Password`, instructorData);
  return response.data;
});

/**
 * @param instructorData -- {userId}
 */
export const fetchInstructorInformation = createAsyncThunk(
  'instructors/fetchInstructorInformation',
  async (instructorData) => {
    const response = await axios.get(`${INSTRUCTOR_INFO_PATH}?UserId=${instructorData.id}`);
    return response.data;
  }
);

/**
 * @param instructorData -- {
  "userId": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phoneNumber": "string",
  "image": string,
  "birthDate": date,
  "sex": "string",
  "bio": "string",
  "specialization": "string",
  "linkedIn": "string",
  "twitter": string,
  "facebook": string,
  "instagram": string,
   "experience": string,
   "officeHours": string,
   location: string,
}
 */
export const addInstructorInformation = createAsyncThunk(
  'instructors/addInstructorInformation',
  async (instructorData) => {
    const response = await axios.post(INSTRUCTOR_INFO_PATH, constructInstructorForm(instructorData));
    return response.data;
  }
);

/**
 * @param instructorData -- {
  "userId": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phoneNumber": "string",
  "image": string,
  "birthDate": date,
  "sex": "string",
  "bio": "string",
  "specialization": "string",
  "linkedIn": "string",
  "twitter": string,
  "facebook": string,
  "instagram": string,
   "experience": string,
   "officeHours": string,
   location: string,
}
 */
export const updateInstructorInfo = createAsyncThunk('instructors/updateInstructorInfo', async (instructorData) => {
  const response = await axios.put(INSTRUCTOR_INFO_PATH, constructInstructorForm(instructorData));
  return response.data;
});

export const fetchInstructorCourses = createAsyncThunk('instructors/fetchInstructorCourses', async (instructorData) => {
  const response = await axios.get(`${INSTRUCTOR_COURSES_PATH}/${instructorData.id}`);
  return response.data || [];
});

/**
 * @param instructorData -- 
 * {
  "userId": "string",
  "coursesIds": [
    0
  ]}
 */
export const deleteInstructorStudentCourses = createAsyncThunk(
  'instructors/deleteInstructorCourses',
  async (instructorData) => {
    await axios.delete(INSTRUCTOR_COURSES_PATH, instructorData);
    return instructorData.userId;
  }
);

/**
 * @param instructorData -- 
 * {
  "userId": "string",
  "coursesIds": [
    0
  ]}
 */
export const addInstructorCourses = createAsyncThunk('instructors/addInstructorCourses', async (instructorData) => {
  const response = await axios.post(`${INSTRUCTOR_COURSES_PATH}`, instructorData);
  return response.data;
});

export const fetchNoneInstructorCourses = createAsyncThunk(
  'instructor/fetchInstructorNoneCourses',
  async ({ userId, currentPage = 1, pageSize = 10 }) => {
    const response = await axios.get(
      `${INSTRUCTOR_COURSES_PATH}/NoneInstructorCourses${userId}?pageNumber=${currentPage}&pageSize=${pageSize}`
    );
    return response.data || [];
  }
);

const constructInstructorForm = (instructorData) => {
  const formData = new FormData();
  if (instructorData) {
    formData.append('userId', instructorData.userId);
  }

  formData.append('firstName', instructorData.firstName);
  formData.append('lastName', instructorData.lastName);
  formData.append('email', instructorData.email);
  formData.append('phoneNumber', instructorData.phoneNumber);
  formData.append('image', instructorData.image);
  formData.append('birthDate', instructorData.birthDate);
  formData.append('sex', instructorData.sex);
  formData.append('bio', instructorData.bio);
  formData.append('specialization', instructorData.specialization);
  formData.append('linkedIn', instructorData.linkedIn);

  formData.append('twitter', instructorData.twitter);
  formData.append('facebook', instructorData.facebook);
  formData.append('instagram', instructorData.instagram);
  formData.append('experience', instructorData.experience);
  formData.append('officeHours', instructorData.officeHours);
  formData.append('location', instructorData.location);

  return formData;
};
