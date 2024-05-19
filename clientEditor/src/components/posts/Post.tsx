import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import he from 'he';

import styles from './Post.module.css';
import { IPost } from '../../types/types';
import useProfile from '../../hooks/useProfile';
import LikeDislikeDevice from '../common/LikeDislikeDevice';
import Edit from '../../assets/images/edit.svg';
import DeleteButton from '../common/DeleteButton';

interface PostProps {
  post: IPost;
}

export default function Post({ post }: PostProps) {
  const navigate = useNavigate();
  const { id, reactedPosts } = useProfile();

  const clientIsAuthor = id === post.user.id;
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
        <p>
          {post.user.username} ({post.user.email})
        </p>
        <div>|</div>
        <p>{post.formattedTime}</p>
        {clientIsAuthor && (
          <>
            <div>|</div>
            <Link className="icon-button" to={`posts/${post.id}/edit`}>
              <img src={Edit} alt="Edit" />
            </Link>
            <DeleteButton data={post} />
          </>
        )}
      </div>
      <p className={styles.description}>{htmlToText(post.content)}</p>
      <div className={styles.bottom}>
        <LikeDislikeDevice lastAction={lastAction} data={post} />
      </div>
    </section>
  );
}
