import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const errorInterceptor = axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      if (error.response.status === 503) {
        const navigate = useNavigate();
        navigate('/sign-in');
        localStorage.removeItem('token');
      }
    } else if (error.request) {
      console.log(error);
      alert('Something went wrong');
    } else {
      alert(error.message);
    }
    return Promise.reject(error);
  }
);

export default errorInterceptor;
