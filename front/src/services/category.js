import axios from 'axios'
import errorInterceptor from './errorInterceptor';
axios.interceptors.response.use(errorInterceptor);

const url = 'http://localhost:8080'

export const getCategories = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${url}/api/category`, {
      headers: { token }
    });
    return response.data
  } catch (error) {
    throw new Error(error.message);
  }
}

export const createCategory = async (payload) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${url}/api/category`, payload, {
      headers: { token }
    });
    return response.data
  } catch (error) {
    throw new Error(error.message);
  }
}

export const removeCategory = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${url}/api/category/${id}`, {
      headers: { token }
    });
    return response.data
  } catch (error) {
    throw new Error(error.message);
  }
}

export const patchCategory = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${url}/api/post/${id}`, {
      headers: { token }
    });
    return response.data
  } catch (error) {
    throw new Error(error.message);
  }
}

