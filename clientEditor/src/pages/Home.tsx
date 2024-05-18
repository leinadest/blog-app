import { IPost } from '../types/types';
import backendService from '../services/backendService';
import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import PostList from '../components/posts/PostList';
import Banner from '../components/common/Banner';
import useProfile from '../hooks/useProfile';
import { Link } from 'react-router-dom';

export default function Home() {
  const [popularPosts, setPopularPosts] = useState<IPost[]>();
  const [newPosts, setNewPosts] = useState<IPost[]>();
  const [reactedPosts, setReactedPosts] = useState<IPost[]>();
  const { id, username, posts } = useProfile();

  useEffect(() => {
    if (!username) return;
    Promise.all([
      backendService.getClientPosts({
        count: '6',
        sort: 'likes',
        order: 'desc',
      }),
      backendService.getClientPosts({
        count: '6',
        sort: 'time',
        order: 'desc',
      }),
      backendService.getReactedPosts(id),
    ])
      .then(([fetchedPopularPosts, fetchedNewPosts, fetchedReactedPosts]) => {
        setPopularPosts(fetchedPopularPosts.data);
        setNewPosts(fetchedNewPosts.data);
        setReactedPosts(fetchedReactedPosts.data.slice(0, 7));
      })
      .catch((err: Error) => console.log(err));
  }, [username, posts, id]);

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
          {!popularPosts || !newPosts || !reactedPosts ? (
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
              <section>
                <h2>Newest Posts You've Reacted To</h2>
                <PostList postsData={reactedPosts} />
              </section>
            </>
          )}
        </main>
      )}
    </Layout>
  );
}
