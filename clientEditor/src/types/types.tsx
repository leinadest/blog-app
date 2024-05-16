export interface IUser {
  id: string;
  username: string;
  email: string;
  posts: string[];
  comments: string[];
  reactedPosts: IReactedPost[];
  reactedComments: IReactedComment[];
}

export interface IReactedComment {
  commentID: string;
  reaction: string;
}

export interface IReactedPost {
  postID: string;
  reaction: string;
}

export interface IComment {
  id: string;
  user: IUser;
  post: string;
  content: string;
  time: string;
  formattedTime: string;
  likes: number;
}

export interface IPost {
  id: string;
  user: IUser;
  title: string;
  content: string;
  time: string;
  formattedTime: string;
  isPublished: boolean;
  comments: string[] | IComment[];
  likes: number;
}

export interface IProfileContext extends IUser {
  setProfile: (user: IUser) => void;
}

export interface APIResponse {
  status: 'success' | 'error';
  data?: string | IUser | IComment | IPost | IUser[] | IComment[] | IPost[];
  message?: string;
  code?: string;
}
