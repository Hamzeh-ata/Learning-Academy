import axios from '@api/axios';
import { buildQueryString } from '@api/query-builder';
import { createAsyncThunk } from '@reduxjs/toolkit';

const coursesEndpoint = '/ClientCourseFilters';

/**
 * @typedef {Object} FilteredCourse
 * @property {number} Id - Course ID
 * @property {string} [Image] - URL of the course image (optional).
 * @property {string} Name - Name of the course.
 * @property {number} Price - Price of the course.
 * @property {number} [DiscountPrice] - Discounted price of the course if available (optional).
 * @property {string} Status - Current status of the course (e.g., 'active', 'inActive').
 * @property {number} StudentsCount - Number of students enrolled in the course.
 * @property {string} [InstructorName] - Name of the instructor (optional).
 * @property {number} [InstructorId] - ID for the instructor (optional).
 * @property {string} [Description] - Description of the course content (optional).
 * @property {number} [OffLinePrice] - Price for an offline version of the course, if available (optional).
 */

/**
 * Fetches courses based on various filters provided.
 *
 * @param {Object} filters - An object containing key-value pairs of filters for querying courses.
 * @param {number} [filters.CourseId] - The id for a course.
 * @param {'name' | 'enrollments' | 'id' | 'price'} [filters.SortBy] - The field to sort the results by.
 * @param {'asc' | 'desc'} [filters.SortOrder] - The order of sorting, either ascending or descending.
 * @param {number} [filters.InstructorId] - The id for an instructor.
 * @param {number} [filters.StudentId] - The id for a student.
 * @param {string} [filters.CourseName] - The name of the course.
 * @param {number} [filters.CategoryId] - The id for a course category.
 * @param {number} [filters.PageNumber] - The number of the current page in pagination.
 * @param {number} [filters.PageSize] - The number of items per page in pagination.
 * @param {number} [filters.UniversityId] - The id for a university.
 * @param {number} [filters.PackageId] - The id for a package.
 * @param {'NonEnroll' | 'NotTaught'} [filters.type] - Type of course filter, e.g., courses not taught or not enrolled.
 * @returns {Promise<FilteredCourse[]>} A promise that resolves to the array of the fetched courses.
 */
export const getCourseByFilters = createAsyncThunk('courses/getCourseByFilters', async (filters) => {
  const queryString = buildQueryString(filters);
  const url = `${coursesEndpoint}?${queryString}`;
  const response = await axios.get(url);
  return response.data;
});
