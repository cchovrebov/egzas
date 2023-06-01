import { createSlice } from '@reduxjs/toolkit'

export const initialError = {
  title: {
    show: false,
    message: 'Title is not correct'
  },
  price: {
    show: false,
    message: 'Price is not correct'
  },
  category: {
    show: false,
    message: 'Category is not correct'
  },
  description: {
    show: false,
    message: 'Description is not correct'
  },
  images: {
    show: false,
    message: 'Images are not correct'
  },
};

const initialState = {
  post: {
    title: '',
    price: 0,
    category: '',
    description: '',
    images: '',
  },
  isLoading: false,
  error: initialError
}

const postEditSlice = createSlice({
  name: 'postEditSlice',
  initialState,
  reducers: {
    setLoadingPostEdit(state, action) {
      state.isLoading = action.payload;
    },
    setPost(state, action) {
      state.post = action.payload;
    },
    updatePost(state, action) {
      state.post[action.payload.inputName] = action.payload.value;
    },
    setError(state, action) {
      state.error = action.payload
    },
  },
})

export const { setPost, setError, updatePost, setLoadingPostEdit } = postEditSlice.actions
export default postEditSlice.reducer