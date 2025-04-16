import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@api/axios';

const API_PATH = '/Student';
const STUDENT_INFO_PATH = `${API_PATH}Info`;
const STUDENT_COURSES_PATH = `${API_PATH}Courses`;

export const fetchStudents = createAsyncThunk('students/fetchStudents', async ({ currentPage = 1, pageSize = 10 }) => {
  const response = await axios.get(`${API_PATH}?pageNumber=${currentPage}&pageSize=${pageSize}`);
  return response.data || [];
});

export const deleteStudent = createAsyncThunk('students/deleteStudent', async (user) => {
  await axios.delete(`${API_PATH}/${user.id}`);
  return user.id;
});

/**
 * @param studentInfo -- {id: string, newPassword: string}
 */
export const studentChangePassword = createAsyncThunk('students/changePassword', async (studentData) => {
  const response = await axios.post(`${API_PATH}/Change-Password`, studentData);
  return response.data;
});

// student courses
export const fetchStudentCourses = createAsyncThunk(
  'students/fetchStudentCourses',
  async ({ userId, currentPage = 1, pageSize = 10 }) => {
    const response = await axios.get(
      `${STUDENT_COURSES_PATH}/${userId}?pageNumber=${currentPage}&pageSize=${pageSize}`
    );
    return response.data || [];
  }
);

export const addStudentCourses = createAsyncThunk('students/addStudentCourses', async (studentData) => {
  const response = await axios.post(`${STUDENT_COURSES_PATH}`, studentData);
  return response.data;
});

export const deleteStudentCourses = createAsyncThunk('students/deleteStudentCourses', async (studentData) => {
  await axios.post(`${STUDENT_COURSES_PATH}/Remove`, studentData);
  return studentData;
});

export const fetchNonEnrolledCourses = createAsyncThunk(
  'students/fetchNonEnrolledCourses',
  async ({ UserId, currentPage = 1, pageSize = 10 }) => {
    const response = await axios.get(
      `${STUDENT_COURSES_PATH}/Non-Enrolled-Courses?UserId=${UserId}&pageNumber=${currentPage}&pageSize=${pageSize}`
    );
    return response.data || [];
  }
);

// Student Info apis
/**
 * @param studentData -- {
  "id": "string",
  "university": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phoneNumber": "string",
  "birthDate": date,
  "sex": "string",
  "profileImage": "string"
}
 */
export const addStudentInformation = createAsyncThunk('students/addStudentInformation', async (studentData) => {
  const response = await axios.post(STUDENT_INFO_PATH, studentData);
  return response.data;
});

/**
 * @param studentData --{
  "id": "string",
  "university": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phoneNumber": "string",
  "birthDate": "2024-03-25T21:47:23.772Z",
  "sex": "string",
  "profileImage": "string"
}
 */
export const updateStudentInfo = createAsyncThunk('students/updateStudentInfo', async (studentData) => {
  const response = await axios.put(`${STUDENT_INFO_PATH}`, constructStudentForm(studentData));
  return response.data;
});

const constructStudentForm = (studentData) => {
  const formData = new FormData();
  if (studentData) {
    formData.append('userId', studentData.id);
  }

  formData.append('firstName', studentData.firstName);
  formData.append('lastName', studentData.lastName);
  formData.append('email', studentData.email);
  formData.append('userName', studentData.email);
  formData.append('phoneNumber', studentData.phoneNumber);
  formData.append('birthDate', studentData.birthDate);
  formData.append('sex', studentData.sex);
  formData.append('university', studentData.university);
  formData.append('image', studentData.image);
  return formData;
};

/**
 * @param studentData -- {id}
 */
export const fetchStudentInformation = createAsyncThunk('students/fetchStudentInformation', async (studentData) => {
  const response = await axios.get(`${STUDENT_INFO_PATH}/${studentData}`);
  return response.data;
});
