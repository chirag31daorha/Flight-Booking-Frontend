import axios from 'axios';

const API = axios.create({
  baseURL: 'http://flight-booking-system-production-8508.up.railway.app',
});

// Attach token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
