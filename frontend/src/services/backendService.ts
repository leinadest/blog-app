export const apiUrl =
  import.meta.env.VITE_BLOG_API_URL || 'http://localhost:3000/api';

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

export async function fetchPosts() {
  const uri = '/posts';
  const response = await fetchData(`${apiUrl}${uri}`);
  return response.data;
}

export async function fetchSignup(
  username: string,
  email: string,
  password: string,
) {
  const uri = '/register';
  const response = await fetchData(`${apiUrl}${uri}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  });
  return response.data;
}

export async function fetchUsers() {
  const uri = '/users';
  const response = await fetchData(`${apiUrl}${uri}`);
  return response.data;
}

// fetchPosts().then((res) => console.log(res));
