import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  posts: null,
  isLoading: false,
}

const postsApproveSlice = createSlice({
  name: 'postsApproveSlice',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.isLoading = action.payload
    },
    setPosts(state, action) {
      state.posts = action.payload
    },
    setError(state, action) {
      state.error = action.payload
    },
  },
})

export const { setLoading, setPosts, setError } = postsApproveSlice.actions
export default postsApproveSlice.reducer