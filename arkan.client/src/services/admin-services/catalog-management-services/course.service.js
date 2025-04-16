import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@api/axios';

const API_PATH = '/Course';

export const fetchCourses = createAsyncThunk('courses/fetchCourses', async ({ currentPage = 1, pageSize = 10 }) => {
  const response = await axios.get(`${API_PATH}?pageNumber=${currentPage}&pageSize=${pageSize}`);
  return response.data || [];
});

export const deleteCourse = createAsyncThunk('courses/deleteCourse', async (course) => {
  await axios.delete(`${API_PATH}/${course.id}`);
  return course.id;
});

export const getCourseById = createAsyncThunk('courses/getCourseById', async (courseId, thunkAPI) => {
  try {
    const response = await axios.get(`${API_PATH}/${courseId}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

/**
 * @param course -- {
 * Name:string,
  *  Description:string,
  *  Price : number($float),
  *  DiscountPrice: number($float),
   * DirectPrice :number($float),
   * EnrollmentLimit :integer($int32),
    *Status :integer($int32),
   * StartDate: string($date-time),
   * EndDate : string($date-time),
   * IsCompleted : boolean,
   * IsFeatured : boolean,
   * InstructorId : integer($int32),
   * Image: string($binary),
    CategoryIds :array
    UniversityIds :array
    OverViewUrl: string
    CoverImage: string
}
 */
export const createCourse = createAsyncThunk('courses/createCourse', async (course) => {
  const response = await axios.post(API_PATH, constructCourseForm(course));
  return response;
});

export const updateCourse = createAsyncThunk('courses/updateCourse', async (course) => {
  const response = await axios.put(API_PATH, constructCourseForm(course));
  return response;
});

const constructCourseForm = (course) => {
  const formData = new FormData();
  if (course.id) {
    formData.append('id', course.id);
  }
  formData.append('name', course.name);
  formData.append('description', course.description);
  formData.append('price', course.price);
  formData.append('discountPrice', course.discountPrice || 0);
  formData.append('directPrice', course.directPrice || 0);
  formData.append('enrollmentLimit', course.enrollmentLimit || 0);
  formData.append('status', course.status);
  formData.append('startDate', course.startDate);
  formData.append('endDate', course.endDate);
  formData.append('isCompleted', Boolean(course.isCompleted));
  formData.append('isFeatured', Boolean(course.isFeatured));
  formData.append('instructorId', course.instructorId);
  formData.append('image', course.image);
  formData.append('overViewUrl', course.overViewUrl);
  formData.append('coverImage', course.coverImage);

  if (course.categoryIds?.length) {
    course.categoryIds.forEach((categoryId, index) => {
      formData.append(`categoryIds[${index}]`, categoryId.toString());
    });
  }
  if (course.universitiesIds?.length) {
    course.universitiesIds.forEach((universityId, index) => {
      formData.append(`universitiesIds[${index}]`, universityId.toString());
    });
  }
  return formData;
};
