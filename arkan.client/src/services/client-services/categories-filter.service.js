import axios from '@api/axios';
import { buildQueryString } from '@api/query-builder';
import { createAsyncThunk } from '@reduxjs/toolkit';

const categoriesEndpoint = '/ClientCategories';

export const getCategoriesByFilters = createAsyncThunk('categoriesFilter/getCategoriesByFilters', async (filters) => {
  const queryString = buildQueryString(filters);
  const url = `${categoriesEndpoint}?${queryString}`;
  const response = await axios.get(url);
  return response.data;
});
