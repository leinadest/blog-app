import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Success from './pages/Success';
import Login from './pages/Login';
import PostPage from './pages/PostPage';
import Search from './pages/Search';
import PostCreatePage from './pages/PostCreatePage';
import PostEditPage from './pages/PostEditPage';
import ErrorBoundary from './components/common/ErrorBoundary';
import Error from './pages/Error';

export default function Router() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <ErrorBoundary>
          <Home />
        </ErrorBoundary>
      ),
      errorElement: <Error />,
    },
    {
      path: '/signup',
      element: (
        <ErrorBoundary>
          <Signup />
        </ErrorBoundary>
      ),
    },
    {
      path: '/success',
      element: <Success />,
    },
    {
      path: '/login',
      element: (
        <ErrorBoundary>
          <Login />
        </ErrorBoundary>
      ),
    },
    {
      path: '/posts/create',
      element: (
        <ErrorBoundary>
          <PostCreatePage />
        </ErrorBoundary>
      ),
    },
    {
      path: '/posts/:postId',
      element: (
        <ErrorBoundary>
          <PostPage />
        </ErrorBoundary>
      ),
    },
    {
      path: '/posts/:postId/edit',
      element: (
        <ErrorBoundary>
          <PostEditPage />
        </ErrorBoundary>
      ),
    },
    {
      path: '/search',
      element: (
        <ErrorBoundary>
          <Search />
        </ErrorBoundary>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}
