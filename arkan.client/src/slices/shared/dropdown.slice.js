import { createSlice } from '@reduxjs/toolkit';
import { getDropDownData } from '@services/shared/dropdowns.service';

const initialState = {
  items: {
    instructors: { data: [] },
    categories: { data: [] },
    packages: { data: [] },
    universities: { data: [] },
    courses: { data: [] }
  },
  loading: false,
  error: null
};

const dropdownsSlice = createSlice({
  name: 'dropdowns',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getDropDownData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDropDownData.fulfilled, (state, action) => {
        const { type, data } = action.payload;
        state.items[type.toLowerCase()] = {
          data: [{ id: null, name: 'No Option' }, ...data]
        };
        state.loading = false;
      })
      .addCase(getDropDownData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch dropdown data';
      });
  }
});

export const selectDropdownItems = (state, dropdownType) => state.dropdowns.items[dropdownType.toLowerCase()]?.data;

export default dropdownsSlice.reducer;
