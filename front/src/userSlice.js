import * as toolkitRaw from '@reduxjs/toolkit';
const { createSlice } = toolkitRaw;

export const initialError = {
  username: {
    show: false,
    message: 'Username is not correct'
  },
  email: {
    show: false,
    message: 'Email is not correct'
  },
  password: {
    show: false,
    message: 'Password is not correct'
  },
  repeatPassword: {
    show: false,
    message: 'Repeat password is not correct'
  },
};

const initialState = {
  user: {
    username: '',
    email: '',
    password: '',
    repeatPassword: '',
    role: '',
    id: '',
  },
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: initialError,
}

const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    setIsLoading(state, action) {
      state.isLoading = action.isLoading
    },
    setError(state, action) {
      state.error = action.payload
    },
    setUser(state, action) {
      state.user[action.payload.inputName] = action.payload.value;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
  },
})

export const { setIsLoading, setError, setUser, setToken } = userSlice.actions
export default userSlice.reducer