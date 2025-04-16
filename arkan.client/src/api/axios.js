import axios from 'axios';
import { IGNORED_ERROR_KEYS, USER_TOKEN } from '../constants';
import alertService from '@services/alert/alert.service';

const instance = axios.create({
  baseURL: `${window.location.origin || import.meta.env.VITE_API_TARGET}/api`
});

// Request interceptor to add the auth token
instance.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem(USER_TOKEN);
    if (userInfo) {
      const token = JSON.parse(userInfo)?.token;
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status == 403) {
      // Forbidden
      alertService.showAlert({
        type: 'error',
        title: '⛔ Forbidden ⛔',
        body: `You don't have access to the requested resources`,
        confirmButtonText: 'Ok'
      });
    }
    if (error.response.status === 500) {
      // Server Error
      alertService.showAlert({
        type: 'error',
        title: '❌ Error ❌',
        body: `Oops something went wrong!`,
        confirmButtonText: 'Ok'
      });
    } else {
      const message =
        error.response?.data?.title ||
        error.response?.data?.key ||
        error.response?.data ||
        error.message ||
        error ||
        'An unknown error occurred';
      if (!IGNORED_ERROR_KEYS.includes(message)) {
        alertService.showAlert({
          type: 'error',
          title: '⛔ Bad Request ⛔',
          body: message,
          confirmButtonText: 'Ok'
        });
      }
    }

    console.error('Failed HTTP request: ', error);
    return Promise.reject(error);
  }
);

export default instance;
