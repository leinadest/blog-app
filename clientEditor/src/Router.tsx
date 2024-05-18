import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Success from './pages/Success';
import Login from './pages/Login';
import PostPage from './pages/PostPage';
import Search from './pages/Search';
import PostCreatePage from './pages/PostCreatePage';
import PostEditPage from './pages/PostEditPage';

export default function Router() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/signup',
      element: <Signup />,
    },
    {
      path: '/success',
      element: <Success />,
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/posts/create',
      element: <PostCreatePage />,
    },
    {
      path: '/posts/:postId',
      element: <PostPage />,
    },
    {
      path: '/posts/:postId/edit',
      element: <PostEditPage />,
    },
    {
      path: '/search',
      element: <Search />,
    },
  ]);

  return <RouterProvider router={router} />;
}