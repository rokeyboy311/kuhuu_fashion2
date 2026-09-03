import axios from 'axios';

const isProd = import.meta.env.PROD;
const DEFAULT_API_URL = isProd
  ? 'https://kuhuu-fashion2.onrender.com/api/v1'
  : 'http://localhost:5000/api/v1';

export const API_BASE_URL = import.meta.env.VITE_API_URL || DEFAULT_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

// Request interceptor — attach JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kf_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401, refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const refreshToken = localStorage.getItem('kf_refresh_token');
      if (!refreshToken) {
        localStorage.removeItem('kf_access_token');
        localStorage.removeItem('kf_refresh_token');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken }
        );
        const { accessToken, refreshToken: newRefresh } = data.data;
        localStorage.setItem('kf_access_token', accessToken);
        localStorage.setItem('kf_refresh_token', newRefresh);
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch {
        localStorage.removeItem('kf_access_token');
        localStorage.removeItem('kf_refresh_token');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
