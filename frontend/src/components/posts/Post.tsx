import styles from './Post.module.css';
import { IPost } from '../../types/types';

interface PostProps {
  data: IPost;
}

export default function Post({ data }: PostProps) {
  const { title, author, time, content } = data;

  return (
    <section className={styles.section}>
      <h2>{title}</h2>
      <p className={styles.meta}>
        {author} | {time}
      </p>
      <p className={styles.descrption}>
        {content.length < 100
          ? content
          : content.substring(0, 100).concat('...')}
      </p>
    </section>
  );
}
