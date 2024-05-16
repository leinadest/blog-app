import { useEffect } from 'react';
import Router from './Router';
import useProfile from './hooks/useProfile';
import backendService from './services/backendService';
import authService from './services/authService';

export default function App() {
  const { setProfile } = useProfile();

  useEffect(() => {
    if (!authService.getToken()) return;
    backendService.getUser().then((user) => {
      setProfile(user.data);
    });
  }, [setProfile]);

  return <Router />;
}
