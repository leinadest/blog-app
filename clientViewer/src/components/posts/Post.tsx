import styles from './Post.module.css';
import { IPost } from '../../types/types';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import useProfile from '../../hooks/useProfile';
import LikeDislikeDevice from '../common/LikeDislikeDevice';

interface PostProps {
  post: IPost;
}

export default function Post({ post }: PostProps) {
  const navigate = useNavigate();
  const { reactedPosts } = useProfile();
  const lastAction = reactedPosts.find(
    (reactedPost) => reactedPost.postID === post.id,
  )?.reaction as undefined | 'like' | 'dislike';

  function onClick(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    const clicked = (e.target as HTMLElement).nodeName;
    if (clicked !== 'IMG') {
      navigate(`/posts/${post.id}`);
    }
  }

  return (
    <section
      id="section"
      tabIndex={0}
      onClick={onClick}
      className={styles.section}
    >
      <h2>{post.title}</h2>
      <div className={styles.meta}>
        <p>{post.user.username}</p>
        <div>|</div>
        <p>{post.formattedTime}</p>
        <div>|</div>
        <LikeDislikeDevice lastAction={lastAction} data={post} />
      </div>
      <p className={styles.description}>{post.content}</p>
    </section>
  );
}
