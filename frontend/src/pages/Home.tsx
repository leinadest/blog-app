import Layout from '../components/layout/Layout';
import PostList from '../components/posts/PostList';
import { IPost } from '../types/types';

export default function Home() {
  const examplePostData: IPost = {
    title: 'aefefafewfcewfcewf',
    author: 'john smith',
    time: 'Jan. 1, 2024',
    content: ''.padEnd(100, ''.padEnd(100, 'x')),
  };
  const popularPostsData: IPost[] = Array(8).fill(examplePostData);
  const newPostsData: IPost[] = Array(8).fill(examplePostData);

  return (
    <Layout>
      <section className="welcome">
        <h2>Welcome</h2>
        <p>
          Sign up and log in to write a blog, and read blogs published by other
          users!
        </p>
      </section>
      <main>
        <section>
          <h2>Popular Blogs</h2>
          <PostList postsData={popularPostsData} />
        </section>
        <section>
          <h2>Newest Blogs</h2>
          <PostList postsData={newPostsData} />
        </section>
      </main>
    </Layout>
  );
}
