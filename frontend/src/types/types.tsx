export interface IUser {
  username: string;
  email: string;
  posts: IPost[];
  comments: IComment[];
  reactedPosts: IPost[];
  reactedComments: IComment[];
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
