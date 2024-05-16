import { useContext } from 'react';
import { ProfileContext } from '../contexts/ProfileContext';

export default function useProfile() {
  return useContext(ProfileContext);
}
