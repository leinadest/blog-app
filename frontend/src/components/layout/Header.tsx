import styles from './Header.module.css';
import { useProfile } from '../../contexts/ProfileContext';
import authService from '../../services/authService';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const { username } = useProfile();

  const isLoggedIn = !!username;

  function logout() {
    authService.logout();
    navigate(0);
  }

  return (
    <header className={styles.header}>
      <Link to="/">
        <h1>Simply Blogs</h1>
      </Link>
      <Link to="/search">Search</Link>
      {isLoggedIn ? (
        <button onClick={logout}>Log out</button>
      ) : (
        <>
          <Link to="/signup">Sign up</Link>
          <Link to="/login">Log in</Link>
        </>
      )}
    </header>
  );
}
