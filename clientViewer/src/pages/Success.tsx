import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';

export default function Success() {
  return (
    <Layout>
      <main>
        <h2>You've successfully signed up!</h2>
        <Link to="/login">
          <button>Log In</button>
        </Link>
      </main>
    </Layout>
  );
}
