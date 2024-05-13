import Post from './Post';
import { IPost } from '../../types/types';
import styles from './PostList.module.css';

interface PostListProps {
  postsData: IPost[];
}

export default function PostList({ postsData }: PostListProps) {
  return (
    <ul className={styles.ul}>
      {postsData.map((postData, index) => (
        <li>
          <Post key={index} data={postData} />
        </li>
      ))}
    </ul>
  );
}
