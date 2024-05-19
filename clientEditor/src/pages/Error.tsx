import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';

export default function Error({
  error,
  handleReset,
}: {
  error?: Error;
  handleReset?: () => void;
}) {
  const message = error ? error.message : 'page not found';
  return (
    <Layout>
      <main>
        <h1>Oops</h1>
        <p>An error has occured: {message}</p>
        <Link onClick={handleReset} to="/">
          Return to the home page
        </Link>
      </main>
    </Layout>
  );
}
