import he from 'he';

import useProfile from '../../hooks/useProfile';
import { IPost } from '../../types/types';
import styles from './PostSection.module.css';
import LikeDislikeDevice from '../common/LikeDislikeDevice';

interface PostDetailsProps {
  post: IPost;
}

export default function PostSection({ post }: PostDetailsProps) {
  const { reactedPosts } = useProfile();

  const lastAction = reactedPosts.find(
    (reactedPost) => reactedPost.postID === post.id,
  )?.reaction as undefined | 'like' | 'dislike';

  return (
    <section className={styles.section}>
      <h2>{he.decode(post.title)}</h2>
      <div className={styles.meta}>
        <p>
          By {post.user.username} ({post.user.email})
        </p>
        <div>|</div>
        <p>{post.formattedTime}</p>
        <div>|</div>
        <LikeDislikeDevice lastAction={lastAction} data={post} />
      </div>
      <p
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></p>
    </section>
  );
}
