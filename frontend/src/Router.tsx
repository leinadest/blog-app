import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Success from './pages/Success';

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
  ]);

  return <RouterProvider router={router} />;
}
