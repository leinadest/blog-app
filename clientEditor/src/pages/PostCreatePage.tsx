import Layout from '../components/layout/Layout';
import PostForm from '../components/posts/PostForm';

export default function PostCreatePage() {
  return (
    <Layout>
      <main>
        <h2>Create Post</h2>
        <PostForm />
      </main>
    </Layout>
  );
}
