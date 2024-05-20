export const API_BASE_URL =
  import.meta.env.VITE_BLOG_API_URL || 'http://localhost:3000/api';

export function getApiUrl(endpoint: string) {
  return `${API_BASE_URL}/${endpoint}`;
}

export async function fetchData(url: string, options = {}) {
  try {
    const response = await fetch(url, options);
    if (import.meta.env.DEV) console.log(response);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', (error as Error).message);
    throw error;
  }
}
