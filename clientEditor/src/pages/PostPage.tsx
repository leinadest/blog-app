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

  useEffect(() => {
    backendService
      .getPost(postId as string)
      .then((fetchedPost) => setPost(fetchedPost.data))
      .catch((err) => console.error(err));
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
