// src/utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  
});

// ✅ 요청 시 토큰 자동 첨부
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // ✅ key 통일
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;