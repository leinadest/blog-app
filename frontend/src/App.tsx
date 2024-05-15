import { useEffect } from 'react';
import Router from './Router';
import useProfile from './hooks/useProfile';
import backendService from './services/backendService';
import authService from './services/authService';
import { IUser } from './types/types';

export default function App() {
  const setProfile = useProfile().setProfile as React.MutableRefObject<
    (user: IUser) => void
  >;

  useEffect(() => {
    if (!authService.getToken()) return;
    backendService.getUser().then((user) => {
      setProfile.current(user.data);
    });
  }, [setProfile]);

  return <Router />;
}
