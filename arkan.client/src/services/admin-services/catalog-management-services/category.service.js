import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@api/axios';

const API_PATH = '/Category';

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
  const response = await axios.get(API_PATH);
  return response.data || [];
});

export const deleteCategory = createAsyncThunk('categories/deleteCategory', async (category) => {
  await axios.delete(`${API_PATH}/${category.id}`);
  return category.id;
});

/**
* @param category -- {
  "id": number,
  "name": "string",
  "status": 0,
  "description": "string",
  "image": "string"
}
 */
export const updateCategory = createAsyncThunk('categories/updateCategory', async (category) => {
  const response = await axios.put(`${API_PATH}`, constructCategoryForm(category));
  return response.data;
});

/**
 * @param category -- {
  "name": "string",
  "description": "string",
  "status": 0,
  "image": "Image File string"
}
 */
export const createCategory = createAsyncThunk('categories/createCategory', async (category) => {
  const response = await axios.post(API_PATH, constructCategoryForm(category));
  return response.data;
});

export const fetchCategoryCourses = createAsyncThunk('categories/fetchCategoryCourses', async (id) => {
  const response = await axios.get(`${API_PATH}Courses/${id}`);
  return response.data;
});

const constructCategoryForm = (category) => {
  const formData = new FormData();
  if (category.id) {
    formData.append('id', category.id);
  }
  formData.append('name', category.name);
  formData.append('description', category.description);
  formData.append('status', category.status ? 1 : 0);
  formData.append('Image', category.image);
  return formData;
};
