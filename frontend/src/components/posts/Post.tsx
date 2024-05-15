import styles from './Post.module.css';
import { IPost } from '../../types/types';
import { Link } from 'react-router-dom';

interface PostProps {
  data: IPost;
}

export default function Post({ data }: PostProps) {
  const { id, title, user, formattedTime, likes, content } = data;

  return (
    <Link to={`/posts/${id}`}>
      <section className={styles.section}>
        <h2>{title}</h2>
        <p className={styles.meta}>
          {user.username} | {formattedTime} | {likes} Likes
        </p>
        <p className={styles.description}>{content}</p>
      </section>
    </Link>
  );
}
