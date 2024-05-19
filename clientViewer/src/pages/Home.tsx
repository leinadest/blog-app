import { IPost } from '../types/types';
import backendService from '../services/backendService';
import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import PostList from '../components/posts/PostList';
import Banner from '../components/common/Banner';
import useProfile from '../hooks/useProfile';

export default function Home() {
  const [popularPosts, setPopularPosts] = useState<IPost[] | null>(null);
  const [newPosts, setNewPosts] = useState<IPost[]>([]);
  const { username, reactedPosts } = useProfile();

  useEffect(() => {
    Promise.all([
      backendService.getPosts({ count: '6', sort: 'likes', order: 'desc' }),
      backendService.getPosts({ count: '6', sort: 'time', order: 'desc' }),
    ])
      .then(([fetchedPopularPosts, fetchedNewPosts]) => {
        setPopularPosts(fetchedPopularPosts.data);
        setNewPosts(fetchedNewPosts.data);
      })
      .catch((err: Error) => console.log(err));
  }, [reactedPosts]);

  return (
    <Layout>
      <Banner heading={`Welcome ${username}`.trim()}>
        Write a blog or read blogs published by other users!
      </Banner>
      <main className="grey-section">
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
