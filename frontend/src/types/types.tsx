export interface IUser {
  username: string;
  email: string;
  posts: IPost[];
  comments: IComment[];
  reactedPosts: IReactedPost[];
  reactedComments: IReactedComment[];
}

export interface IComment {
  user: IUser;
  post: string;
  content: string;
  time: string;
  formattedTime: string;
  likes: number;
}

export interface IPost {
  user: IUser;
  title: string;
  content: string;
  time: string;
  formattedTime: string;
  isPublished: boolean;
  comments: IComment[];
  likes: number;
}

export interface IReactedComment {
  commentID: string;
  reaction: string;
}

export interface IReactedPost {
  postID: string;
  reaction: string;
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
