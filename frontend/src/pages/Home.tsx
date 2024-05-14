import { IPost } from '../types/types';
import { fetchPosts } from '../services/backendService';
import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import PostList from '../components/posts/PostList';
import Banner from '../components/common/Banner';

export default function Home() {
  const [popularPosts, setPopularPosts] = useState<IPost[] | null>(null);
  const [newPosts, setNewPosts] = useState<IPost[]>([]);

  useEffect(() => {
    fetchPosts()
      .then((posts: IPost[]) => {
        const popularPostsFetched = posts
          .sort((a, b) => a.likes - b.likes)
          .slice(0, 6);
        const newPostsFetched = posts
          .sort((a, b) => Date.parse(b.time) - Date.parse(a.time))
          .slice(0, 6);
        setPopularPosts(popularPostsFetched);
        setNewPosts(newPostsFetched);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Layout>
      <Banner heading="Welcome">
        Sign up and log in to write a blog, and read blogs published by other
        users!
      </Banner>
      <main>
        {!popularPosts ? (
          <h2 className="loading">Loading...</h2>
        ) : (
          <>
            <section>
              <h2>Popular Blogs</h2>
              <PostList postsData={popularPosts} />
            </section>
            <section>
              <h2>Newest Blogs</h2>
              <PostList postsData={newPosts} />
            </section>
          </>
        )}
      </main>
    </Layout>
  );
}
