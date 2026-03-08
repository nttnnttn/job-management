// src/api/client.ts

import { client } from "../api-client/client.gen";


export const setupApiClient = () => {
  // 1. Set Base URL (use import.meta.env for Vite or process.env for CRA)
  const baseUrl = process.env.REACT_APP_API_BASE || 'http://localhost:3000';
  
  client.setConfig({
    baseURL: baseUrl,
  });

  // 2. Add Request Interceptor (Auth)
  client.instance.interceptors.request.use((request) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`);
    }
    return request;
  });

  // 3. Add Response Interceptor (Error Handling)
  client.instance.interceptors.response.use((response) => {
    if (response.status === 401) {
      console.error('Session expired. Redirecting to login...');
      // Optional: localStorage.clear(); window.location.href = '/login';
    }
    return response;
  });
};
