import styles from './Post.module.css';
import { IPost } from '../../types/types';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import useProfile from '../../hooks/useProfile';
import LikeDislikeDevice from '../common/LikeDislikeDevice';
import he from 'he';

interface PostProps {
  post: IPost;
}

export default function Post({ post }: PostProps) {
  const navigate = useNavigate();
  const { reactedPosts } = useProfile();
  const lastAction = reactedPosts.find(
    (reactedPost) => reactedPost.postID === post.id,
  )?.reaction as undefined | 'like' | 'dislike';

  function htmlToText(html: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }

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
      <h2>{he.decode(post.title)}</h2>
      <div className={styles.meta}>
        <p>{post.user.username}</p>
        <div>|</div>
        <p>{post.formattedTime}</p>
        <div>|</div>
        <LikeDislikeDevice lastAction={lastAction} data={post} />
      </div>
      <p className={styles.description}>{htmlToText(post.content)}</p>
    </section>
  );
}
