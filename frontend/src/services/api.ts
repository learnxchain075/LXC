import axios from 'axios';
import AppConfig from '../config/config';

const api = axios.create({
  baseURL: AppConfig.apiGateway.BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AppConfig.LOCAL_STORAGE_ACCESS_TOKEN_KEY);
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
