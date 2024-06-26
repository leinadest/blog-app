import authService from './authService';
import { fetchData, getApiUrl } from './helpers';

function getOptions(method?: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: object) {
  const token = authService.getToken();
  const options: RequestInit = {
    headers: {
      Authorization: `bearer ${token}`,
    },
  };

  if (method === 'POST' || method === 'PUT') {
    options.method = method;
    (options.headers as Record<string, string>)['Content-Type'] =
      'application/json';
    options.body = JSON.stringify(body);
  }

  return options;
}

const backendService = {
  getPosts: async (queryParams: Record<string, string>) => {
    const params = new URLSearchParams(queryParams).toString();
    const response = await fetchData(
      getApiUrl(`posts?${params}`),
      getOptions(),
    );
    return response;
  },

  getPost: async (postId: string) => {
    const response = await fetchData(
      getApiUrl(`posts/${postId}`),
      getOptions(),
    );
    return response;
  },

  getClientPost: async (postId: string) => {
    const response = await fetchData(
      getApiUrl(`posts/${postId}/auth`),
      getOptions(),
    );
    return response;
  },

  react: async (
    route: 'posts' | 'comments',
    dataId: string,
    action: 'like' | 'dislike',
  ) => {
    const response = await fetchData(
      getApiUrl(`${route}/${dataId}/react`),
      getOptions('PUT', { action }),
    );
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

  createComment: async (postId: string, content: string) => {
    const response = await fetchData(
      getApiUrl(`posts/${postId}/comments`),
      getOptions('POST', { content }),
    );
    return response;
  },
};

export default backendService;
