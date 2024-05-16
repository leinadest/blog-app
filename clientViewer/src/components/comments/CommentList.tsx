import { IComment } from '../../types/types';
import Comment from './Comment';
import styles from './CommentList.module.css';

interface CommentListProps {
  comments: IComment[];
}

export default function CommentList({ comments }: CommentListProps) {
  return (
    <ul className={styles.ul}>
      {comments.map((comment) => (
        <li key={comment.id}>
          <hr />
          <Comment comment={comment} />
        </li>
      ))}
    </ul>
  );
}
