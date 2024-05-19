import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import backendService from '../services/backendService';
import Layout from '../components/layout/Layout';
import { IComment, IPost } from '../types/types';
import PostSection from '../components/posts/PostSection';
import CommentSection from '../components/comments/CommentSection';
import useProfile from '../hooks/useProfile';

export default function PostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState<IPost>();
  const profile = useProfile();
  const [error, setError] = useState<Error>();

  if (error) throw error;

  useEffect(() => {
    backendService
      .getPost(postId as string)
      .then((response) => {
        if (response.status === 'error') {
          throw new Error(response.message);
        }
        setPost(response.data);
      })
      .catch((err) => setError(err));
  }, [postId, profile]);

  return (
    <Layout>
      <main>
        {!post ? (
          <h2 className="loading">Loading...</h2>
        ) : (
          <>
            <PostSection post={post} />
            <CommentSection comments={post.comments as IComment[]} />
          </>
        )}
      </main>
    </Layout>
  );
}
