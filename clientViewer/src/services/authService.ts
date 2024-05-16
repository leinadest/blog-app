import { getApiUrl, fetchData } from './helpers';
import localStorageService from './localStorageService';

const authService = {
  signup: async (username: string, email: string, password: string) => {
    const response = await fetchData(getApiUrl('register'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });
    return response;
  },

  login: async (username: string, password: string) => {
    const response = await fetchData(getApiUrl('login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    return response;
  },

  logout: () => localStorageService.removeItem('token'),

  setToken: (token: string) => localStorageService.setItem('token', token),

  getToken: () => localStorageService.getItem('token'),
};

export default authService;
