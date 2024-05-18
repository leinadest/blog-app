import React, { createContext, useRef, useState } from 'react';
import * as types from '../types/types';

export const ProfileContext = createContext<types.IProfileContext>({
  id: '',
  username: '',
  email: '',
  posts: [],
  comments: [],
  reactedPosts: [],
  reactedComments: [],
  setProfile: () => null,
});

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [id, setId] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [posts, setPosts] = useState<string[]>([]);
  const [comments, setComments] = useState<string[]>([]);
  const [reactedPosts, setReactedPosts] = useState<types.IReactedPost[]>([]);
  const [reactedComments, setReactedComments] = useState<
    types.IReactedComment[]
  >([]);

  const setProfile = useRef((user: types.IUser) => {
    setId(user.id);
    setUsername(user.username);
    setEmail(user.email);
    setPosts(user.posts);
    setComments(user.comments);
    setReactedPosts(user.reactedPosts);
    setReactedComments(user.reactedComments);
    console.log(user);
  });

  return (
    <ProfileContext.Provider
      value={{
        id,
        username,
        email,
        posts,
        comments,
        reactedPosts,
        reactedComments,
        setProfile: setProfile.current,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}
