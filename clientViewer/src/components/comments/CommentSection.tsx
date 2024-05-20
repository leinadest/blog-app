import * as yup from 'yup';
import he from 'he';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useContext } from 'react';

import { IComment } from '../../types/types';
import CommentList from './CommentList';
import styles from './CommentSection.module.css';
import useProfile from '../../hooks/useProfile';
import { yupResolver } from '@hookform/resolvers/yup';
import backendService from '../../services/backendService';
import { PageContext } from '../../pages/PostPage';

interface CommentSectionProps {
  comments: IComment[];
}

const validationSchema = yup.object({
  content: yup
    .string()
    .max(2000, 'Comment must be within 2000 characters')
    .required('Comment must not be empty'),
});

export default function CommentSection({ comments }: CommentSectionProps) {
  const { postId } = useParams();
  const { username } = useProfile();
  const { register, handleSubmit, formState, setError } = useForm({
    defaultValues: { content: '' },
    resolver: yupResolver(validationSchema),
  });
  const { refreshPost } = useContext(PageContext);

  const { errors, isSubmitting } = formState;
  const isLoggedIn = !!username;

  function onSubmit(data: { content: string }) {
    backendService
      .createComment(postId as string, he.encode(data.content))
      .then(() => refreshPost())
      .catch(() => {
        setError('content', {
          type: 'manual',
          message: 'An error has occurred; please try again',
        });
      });
  }

  return (
    <section className={styles.section}>
      <h2>Comments</h2>
      <p>There are {comments.length} comments</p>
      <CommentList comments={comments} />
      {isLoggedIn && (
        <>
          <h3>Create a new comment</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <textarea {...register('content')}></textarea>
            <p className="error">{errors.content?.message}</p>
            <button className={styles.submit} disabled={isSubmitting}>
              Submit
            </button>
          </form>
        </>
      )}
    </section>
  );
}
