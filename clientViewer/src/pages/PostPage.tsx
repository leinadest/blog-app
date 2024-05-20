import { createContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import backendService from '../services/backendService';
import Layout from '../components/layout/Layout';
import { IComment, IPost } from '../types/types';
import PostSection from '../components/posts/PostSection';
import CommentSection from '../components/comments/CommentSection';
import useProfile from '../hooks/useProfile';

export const PageContext = createContext<{ refreshPost: () => void }>({
  refreshPost: () => null,
});

export default function PostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState<IPost>();
  const profile = useProfile();
  const [error, setError] = useState<Error>();

  if (error) throw error;

  const clientIsAuthor = profile.posts.includes(postId as string);

  const refreshPost = useRef(async () => {
    const { getPost, getClientPost } = backendService;
    const properGetPost = clientIsAuthor ? getClientPost : getPost;
    try {
      const res = await properGetPost(postId as string);
      if (res.status === 'error') {
        throw new Error(res.message);
      }
      setPost(res.data);
    } catch (err) {
      setError(err as Error);
    }
  }).current;

  useEffect(() => {
    refreshPost();
  }, [refreshPost, profile]);

  return (
    <Layout>
      <main>
        {!post ? (
          <h2 className="loading">Loading...</h2>
        ) : (
          <>
            <PostSection post={post} />
            <PageContext.Provider value={{ refreshPost }}>
              <CommentSection comments={post.comments as IComment[]} />
            </PageContext.Provider>
          </>
        )}
      </main>
    </Layout>
  );
}
