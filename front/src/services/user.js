import axios from 'axios'
import errorInterceptor from './errorInterceptor';
axios.interceptors.response.use(errorInterceptor);

const url = 'http://localhost:8080'

export const signUpReq = async (payload) => {
  try {
    const response = await axios.post(`${url}/api/user`, payload);
    return response.data
  } catch (error) {
    throw new Error(error.message);
  }
}

export const signInReq = async (payload) => {
  try {
    const response = await axios.post(`${url}/api/auth/sign-in`, payload);
    return response.data
  } catch (error) {
    throw new Error(error.message);
  }
}

export const validate = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${url}/api/auth/validate`, null, {
      headers: { token }
    });
    return response.data
  } catch (error) {
    throw new Error(error.message);
  }
}