import api from './axios';

export const authApi = {
  /**
   * Register a new user account
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Log in user
   */
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Get logged-in user profile
   */
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export default authApi;
