import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true, // 👈 Sab se zaroori! Cookie session ke liye
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatic error handling (agar token expire ho jaye)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("User session expired ya unauthorized hai.");
    }
    return Promise.reject(error);
  }
);

export default api;