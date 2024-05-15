import { IComment } from '../../types/types';
import styles from './Comment.module.css';

interface CommentProps {
  comment: IComment;
}

export default function Comment({ comment }: CommentProps) {
  return (
    <section className={styles.section}>
      <p>
        {comment.user.username} ({comment.user.email})
      </p>
      <p>{comment.content}</p>
      <p>{comment.likes} Likes</p>
    </section>
  );
}
