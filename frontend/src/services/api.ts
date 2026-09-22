import axios from 'axios';

export const api = axios.create({
  // Same-origin '/api' locally & behind nginx; absolute URL when split-hosted
  // (set VITE_API_URL=https://<your-backend>/api on Vercel).
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('sb_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});
