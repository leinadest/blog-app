import styles from './Header.module.css';
import useProfile from '../../hooks/useProfile';
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
        <h1>Simply Edit Blogs</h1>
      </Link>
      <Link to={import.meta.env.VITE_BLOGS_VIEW_PAGE}>View Blogs</Link>
      <Link to="/search">Search</Link>
      {isLoggedIn ? (
        <>
          <Link to="/posts/create">Create</Link>
          <button onClick={logout}>Log out</button>
        </>
      ) : (
        <>
          <Link to="/signup">Sign up</Link>
          <Link to="/login">Log in</Link>
        </>
      )}
    </header>
  );
}
