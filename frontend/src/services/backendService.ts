import authService from './authService';
import { fetchData, getApiUrl } from './helpers';

function getOptions() {
  const token = authService.getToken();
  return {
    headers: {
      Authorization: `bearer ${token}`,
    },
  };
}

const backendService = {
  getPosts: async () => {
    const response = await fetchData(getApiUrl('posts'), getOptions());
    return response;
  },

  getUsers: async () => {
    const response = await fetchData(getApiUrl('users'), getOptions());
    return response;
  },

  getUser: async () => {
    const response = await fetchData(getApiUrl('users/profile'), getOptions());
    return response;
  },
};

export default backendService;
