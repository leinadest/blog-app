import { IComment, IPost } from '../../types/types';
import backendService from '../../services/backendService';
import useProfile from '../../hooks/useProfile';
import ThumbUp from '../../assets/images/thumb_up.svg';
import ThumbDown from '../../assets/images/thumb_down.svg';
import RedThumbDown from '../../assets/images/red_thumb_down.svg';
import BlueThumbUp from '../../assets/images/blue_thumb_up.svg';
import styles from './LikeDislikeDevice.module.css';

interface LikeDislikeDeviceProps {
  data: IPost | IComment;
  lastAction?: 'like' | 'dislike';
}

export default function LikeDislikeDevice({
  data,
  lastAction,
}: LikeDislikeDeviceProps) {
  const { setProfile } = useProfile();
  const dataType = 'title' in data ? 'post' : 'comment';

  function handleLike() {
    if (lastAction === 'like') return;
    backendService
      .react(`${dataType}s`, data.id, 'like')
      .then(() => backendService.getUser())
      .then((user) => setProfile(user.data))
      .catch((err) => console.error(err));
  }

  function handleDislike() {
    if (lastAction === 'dislike') return;
    backendService
      .react(`${dataType}s`, data.id, 'dislike')
      .then(() => backendService.getUser())
      .then((user) => setProfile(user.data))
      .catch((err) => console.error(err));
  }

  return (
    <div className={styles.div}>
      <button className={styles.button} onClick={handleLike}>
        <img
          className={styles.img}
          src={lastAction && lastAction === 'like' ? BlueThumbUp : ThumbUp}
        />
      </button>
      <p>{data.likes}</p>
      <button className={styles.button} onClick={handleDislike}>
        <img
          className={styles.img}
          src={
            lastAction && lastAction === 'dislike' ? RedThumbDown : ThumbDown
          }
        />
      </button>
    </div>
  );
}
