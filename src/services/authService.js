import api from './api';

export const authService = {
  login: async (email, password) => {
    return await api.post('/auth/login', { email, password });
  },
  register: async (userData) => {
    return await api.post('/auth/register', userData);
  },
  getCurrentUser: async () => {
    return await api.get('/auth/me');
  },
  uploadVerification: async (formData) => {
    // Requires multipart/form-data, but Axios handles FormData automatically
    return await api.post('/auth/verify', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};
