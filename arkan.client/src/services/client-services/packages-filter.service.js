import axios from '@api/axios';
import { buildQueryString } from '@api/query-builder';
import { createAsyncThunk } from '@reduxjs/toolkit';

const PACKAGES_ENDPOINT = '/ClientPackages';

export const getPackagesByFilters = createAsyncThunk('packagesFilter/getPackagesByFilters', async (filters) => {
  const queryString = buildQueryString(filters);
  const url = `${PACKAGES_ENDPOINT}?${queryString}`;
  const response = await axios.get(url);
  return response.data;
});

export const getPackageById = createAsyncThunk('packagesFilter/getPackageById', async (id) => {
  const url = `${PACKAGES_ENDPOINT}/${id}`;
  const response = await axios.get(url);
  return response.data;
});
