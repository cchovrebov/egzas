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

const postCreateSlice = createSlice({
  name: 'postCreateSlice',
  initialState,
  reducers: {
    setLoadingPostCreate(state, action) {
      state.isLoading = action.payload;
    },
    setPost(state, action) {
      state.post[action.payload.inputName] = action.payload.value;
    },
    setError(state, action) {
      state.error = action.payload
    },
  },
})

export const { setPost, setError, setLoadingPostCreate } = postCreateSlice.actions
export default postCreateSlice.reducer