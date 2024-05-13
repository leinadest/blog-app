import { Link } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <Link to="/">
        <h1>Simply Blogs</h1>
      </Link>
      <Link to="/search">Search</Link>
      <Link to="/signup">Sign up</Link>
      <Link to="/login">Log in</Link>
    </header>
  );
}
