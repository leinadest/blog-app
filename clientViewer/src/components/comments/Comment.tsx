import he from 'he';

import useProfile from '../../hooks/useProfile';
import { IComment } from '../../types/types';
import LikeDislikeDevice from '../common/LikeDislikeDevice';
import styles from './Comment.module.css';

interface CommentProps {
  comment: IComment;
}

export default function Comment({ comment }: CommentProps) {
  const { reactedComments } = useProfile();

  const lastAction = reactedComments.find(
    (reactedComment) => reactedComment.commentID === comment.id,
  )?.reaction as undefined | 'like' | 'dislike';

  return (
    <section className={styles.section}>
      <p>
        {comment.user.username} ({comment.user.email})
      </p>
      <p>{he.decode(comment.content)}</p>
      <LikeDislikeDevice lastAction={lastAction} data={comment} />
    </section>
  );
}
