async function fetchData(url: string, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    console.log(response);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', (error as Error).message);
    throw error;
  }
}

const apiUrl = import.meta.env.VITE_BLOG_API_URL || 'http://localhost:3000/api';

export async function fetchPosts() {
  const uri = '/posts';
  const response = await fetchData(`${apiUrl}${uri}`);
  return response.data;
}

fetchPosts().then((res) => console.log(res));
