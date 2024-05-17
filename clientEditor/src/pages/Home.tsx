import { IPost } from '../types/types';
import backendService from '../services/backendService';
import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import PostList from '../components/posts/PostList';
import Banner from '../components/common/Banner';
import useProfile from '../hooks/useProfile';
import { Link } from 'react-router-dom';

export default function Home() {
  const [popularPosts, setPopularPosts] = useState<IPost[] | null>(null);
  const [newPosts, setNewPosts] = useState<IPost[]>([]);
  const { username } = useProfile();

  useEffect(() => {
    if (!username) return;
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
  }, [username]);

  return (
    <Layout>
      <Banner
        heading={`Welcome ${username}`.trim()}
        paragraph={
          username
            ? 'Create posts and edit posts and comments!'
            : 'Sign up and log in to create posts and edit posts and comments!'
        }
      >
        {username && (
          <Link to="posts/create">
            <button>Create a new post</button>
          </Link>
        )}
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
