import styles from './Post.module.css';
import { IPost } from '../../types/types';

interface PostProps {
  data: IPost;
}

export default function Post({ data }: PostProps) {
  const { title, user, formattedTime, content } = data;

  return (
    <section className={styles.section}>
      <h2>{title}</h2>
      <p className={styles.meta}>
        {user?.username} | {formattedTime}
      </p>
      <p className={styles.description}>{content}</p>
    </section>
  );
}
