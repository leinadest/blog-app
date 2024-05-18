import useProfile from '../../hooks/useProfile';
import { IComment } from '../../types/types';
import LikeDislikeDevice from '../common/LikeDislikeDevice';
import Edit from '../../assets/images/edit.svg';
import styles from './Comment.module.css';
import DeleteButton from '../common/DeleteButton';

interface CommentProps {
  comment: IComment;
}

export default function Comment({ comment }: CommentProps) {
  const { id, reactedComments } = useProfile();
  const clientIsAuthor = id === comment.user.id;

  const lastAction = reactedComments.find(
    (reactedComment) => reactedComment.commentID === comment.id,
  )?.reaction as undefined | 'like' | 'dislike';

  return (
    <section className={styles.section}>
      <p>
        {comment.user.username} ({comment.user.email})
      </p>
      {clientIsAuthor && (
        <>
          <button className="icon-button">
            <img src={Edit} />
          </button>
          <DeleteButton data={comment} />
        </>
      )}
      <p className={styles.content}>{comment.content}</p>
      <LikeDislikeDevice lastAction={lastAction} data={comment} />
    </section>
  );
}