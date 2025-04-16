import axios from '@api/axios';
import { buildQueryString } from '@api/query-builder';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const constructFormData = (fields) => {
  const formData = new FormData();
  Object.keys(fields).forEach((key) => {
    if (Array.isArray(fields[key])) {
      fields[key].forEach((item, index) => {
        formData.append(`${key}[${index}]`, item.toString());
      });
    } else {
      formData.append(key, fields[key] === undefined ? null : fields[key]);
    }
  });
  return formData;
};

export const createCRUDThunks = (entity, endpoint, withFormData) => ({
  fetchAll: createAsyncThunk(`${entity}/fetchAll`, async () => {
    const response = await axios.get(endpoint);
    return response?.data;
  }),
  fetchPaginated: createAsyncThunk(`${entity}/fetchPaginated`, async (filters) => {
    const queryString = buildQueryString(filters);
    const url = `${endpoint}?${queryString}`;
    const response = await axios.get(url);
    return response?.data;
  }),
  create: createAsyncThunk(`${entity}/create`, async (data) => {
    const response = await axios.post(endpoint, withFormData ? constructFormData(data) : data);
    return response?.data;
  }),
  update: createAsyncThunk(`${entity}/update`, async (data) => {
    const response = await axios.put(endpoint, withFormData ? constructFormData(data) : data);
    return response?.data;
  }),
  get: createAsyncThunk(`${entity}/get`, async (id) => {
    const response = await axios.get(`${endpoint}/${id}`);
    return response?.data;
  }),
  delete: createAsyncThunk(`${entity}/delete`, async (id) => {
    await axios.delete(`${endpoint}/${id}`);
    return id;
  })
});

export const reducerActions = {
  handlePending: (state) => {
    state.loading = true;
  },
  handleFulfilled: (adapterMethod) => (state, action) => {
    adapterMethod(state, action.payload);
    state.loading = false;
    state.error = null;
  },
  handleRejected: (state, action) => {
    state.loading = false;
    state.error = action.error.message || action.payload || 'Some thing went wrong';
  }
};
