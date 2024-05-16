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
  const { username } = useProfile();

  useEffect(() => {
    Promise.all([
      backendService.getClientPosts({
        count: '6',
        sort: 'likes',
        order: 'asc',
      }),
      backendService.getClientPosts({
        count: '6',
        sort: 'time',
        order: 'desc',
      }),
    ])
      .then(([fetchedPopularPosts, fetchedNewPosts]) => {
        setPopularPosts(fetchedPopularPosts.data);
        setNewPosts(fetchedNewPosts.data);
      })
      .catch((err: Error) => console.log(err));
  }, []);

  return (
    <Layout>
      <Banner heading={`Welcome ${username}`.trim()}>
        {username
          ? 'Create and edit your blogs and comments!'
          : 'Sign up and log in to create and edit your blogs and comments!'}
      </Banner>
      {username && (
        <main>
          {!popularPosts ? (
            <h2>Loading...</h2>
          ) : (
            <>
              <section>
                <h2>Your Popular Posts</h2>
                <PostList postsData={popularPosts} />
              </section>
              <section>
                <h2>Your Newest Posts</h2>
                <PostList postsData={newPosts} />
              </section>
            </>
          )}
        </main>
      )}
    </Layout>
  );
}
