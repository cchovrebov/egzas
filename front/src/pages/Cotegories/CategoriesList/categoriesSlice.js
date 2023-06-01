import { createSlice } from '@reduxjs/toolkit'

export const initialError = {
  title: {
    show: false,
    message: 'Title is not correct'
  },
};

const initialState = {
  category: {
    title: '',
  },
  categories: [],
  isLoading: false,
  error: initialError,
}

const categoriesSlice = createSlice({
  name: 'categoriesSlice',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setCategories(state, action) {
      state.categories = action.payload;
    },
    setCategory(state, action) {
      state.category[action.payload.inputName] = action.payload.value;
    },
    setError(state, action) {
      state.error = action.payload
    },
  },
})

export const { setCategory, setLoading, setCategories, setError } = categoriesSlice.actions
export default categoriesSlice.reducer