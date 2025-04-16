import axios from '@api/axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const apiEndPoint = '/DropDown';

/**
 * Fetches dropdowns values based on various params provided.
 *
 * @param {Object} params -
 * @param {number} [filters.PageNumber] - The number of the current page in pagination.
 * @param {number} [filters.PageSize] - The number of items per page in pagination.
 * @param {'Universities' | 'Packages' | 'Categories' | 'Instructors'} [filters.type] - The type field which is the entity to get the results by.
 * @param {string} [filters.Name] - The field to search the result by.
 * @returns {Promise<FilteredCourse[]>} A promise that resolves to the array of the fetched courses.
 */
export const getDropDownData = createAsyncThunk('dropdowns/getDropDownData', async (params) => {
  const response = await axios.post(apiEndPoint, params);
  return response.data;
});
