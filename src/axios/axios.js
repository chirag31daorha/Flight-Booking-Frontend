import axios from 'axios';

const API = axios.create({
  baseURL: 'https://flight-booking-system-gd23.onrender.com/',
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
