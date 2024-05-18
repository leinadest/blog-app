import { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import PostForm from '../components/posts/PostForm';
import backendService from '../services/backendService';
import { useParams } from 'react-router-dom';

export default function PostEditPage() {
  const { postId } = useParams();
  const [post, setPost] = useState();

  useEffect(() => {
    backendService
      .getClientPost(postId as string)
      .then((post) => {
        setPost(post.data);
      })
      .catch((err: Error) => console.log(err));
  }, [postId]);

  return (
    <Layout>
      <main>
        {!post ? (
          <h2>Loading...</h2>
        ) : (
          <>
            <h2>Edit Post</h2>
            <PostForm postData={post} />
          </>
        )}
      </main>
    </Layout>
  );
}
