import React, { createContext, useContext, useState } from 'react';
import * as types from '../types/types';
import authService from '../services/authService';
import backendService from '../services/backendService';

export const ProfileContext = createContext<types.IProfileContext>({
  username: '',
  email: '',
  posts: [],
  comments: [],
  reactedPosts: [],
  reactedComments: [],
  setProfile: () => null,
});

export function useProfile() {
  return useContext(ProfileContext);
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [posts, setPosts] = useState<types.IPost[]>([]);
  const [comments, setComments] = useState<types.IComment[]>([]);
  const [reactedPosts, setReactedPosts] = useState<types.IReactedPost[]>([]);
  const [reactedComments, setReactedComments] = useState<
    types.IReactedComment[]
  >([]);

  function setProfile(user: types.IUser) {
    setUsername(user.username);
    setEmail(user.email);
    setPosts(user.posts);
    setComments(user.comments);
    setReactedPosts(user.reactedPosts);
    setReactedComments(user.reactedComments);
  }

  return (
    <ProfileContext.Provider
      value={{
        username,
        email,
        posts,
        comments,
        reactedPosts,
        reactedComments,
        setProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}
