import useProfile from '../../hooks/useProfile';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import he from 'he';
import DOMPurify from 'dompurify';

import { IComment } from '../../types/types';
import LikeDislikeDevice from '../common/LikeDislikeDevice';
import Edit from '../../assets/images/edit.svg';
import styles from './Comment.module.css';
import DeleteButton from '../common/DeleteButton';
import { yupResolver } from '@hookform/resolvers/yup';
import backendService from '../../services/backendService';
import { PageContext } from '../../pages/PostPage';

interface CommentProps {
  comment: IComment;
}

const validationSchema = yup.object({
  content: yup
    .string()
    .max(2000, 'Content must be within 2,000 characters')
    .required('Content is required'),
});

export default function Comment({ comment }: CommentProps) {
  const [mode, setMode] = useState<'display' | 'edit'>('display');
  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      content: he.decode(comment.content),
    },
    resolver: yupResolver(validationSchema),
  });
  const { errors, isSubmitting } = formState;
  const { id, reactedComments } = useProfile();
  const { refreshPost } = useContext(PageContext);

  const clientIsAuthor = id === comment.user.id;
  const lastAction = reactedComments.find(
    (reactedComment) => reactedComment.commentID === comment.id,
  )?.reaction as undefined | 'like' | 'dislike';

  function toggleMode() {
    setMode(mode === 'display' ? 'edit' : 'display');
  }

  function onSubmit(data: { content: string }) {
    const purifiedContent = DOMPurify.sanitize(data.content);
    backendService
      .updateComment(comment.id, purifiedContent)
      .then(() => refreshPost())
      .then(() => setMode('display'))
      .catch((err) => console.log(err));
  }

  return (
    <section className={styles.section}>
      <p>
        {comment.user.username} ({comment.user.email})
      </p>
      {clientIsAuthor && (
        <>
          <button className="icon-button" onClick={toggleMode}>
            <img src={Edit} />
          </button>
          <DeleteButton data={comment} />
        </>
      )}
      {mode === 'display' ? (
        <p className={styles.content}>{he.decode(comment.content)}</p>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <textarea id="content" {...register('content')}></textarea>
          <button disabled={isSubmitting}>Submit</button>
          <p className="error">{errors.content?.message}</p>
        </form>
      )}

      <LikeDislikeDevice lastAction={lastAction} data={comment} />
    </section>
  );
}
