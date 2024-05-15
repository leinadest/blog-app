import { IPost } from '../../types/types';
import styles from './PostSection.module.css';

interface PostDetailsProps {
  post: IPost;
}

export default function PostSection({ post }: PostDetailsProps) {
  return (
    <section className={styles.section}>
      <h2>{post.title}</h2>
      <p>
        By {post.user.username} | {post.formattedTime} | {post.likes} Likes
      </p>
      <p className={styles.content}>{post.content}</p>
    </section>
  );
}
