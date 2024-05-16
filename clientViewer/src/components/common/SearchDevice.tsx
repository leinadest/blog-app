import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import Search from '../../assets/images/search.svg';
import styles from './SearchDevice.module.css';
import { IPost } from '../../types/types';
import backendService from '../../services/backendService';
import { useEffect, useRef } from 'react';
import useProfile from '../../hooks/useProfile';

interface SearchDeviceProps {
  setData: React.Dispatch<React.SetStateAction<IPost[]>>;
}

const validationSchema = yup.object({
  search: yup.string().required('Search input must not be empty'),
});

export default function SearchDevice({ setData }: SearchDeviceProps) {
  const { register, formState, handleSubmit, watch } = useForm({
    defaultValues: { search: '' },
    resolver: yupResolver(validationSchema),
  });
  const { errors, isSubmitting } = formState;

  const setPosts = useRef((data: { search: string }) => {
    backendService
      .getPosts({ query: data.search })
      .then((posts) => setData(posts.data))
      .catch((err) => console.error(err));
  }).current;

  const { reactedPosts } = useProfile();
  useEffect(() => {
    const data = watch();
    setPosts(data);
  }, [reactedPosts, watch, setPosts]);

  return (
    <form className={styles.form} onSubmit={handleSubmit(setPosts)}>
      <div className={styles['form-group']}>
        <input type="text" {...register('search')} />
        <button disabled={isSubmitting}>
          <img src={Search}></img>
        </button>
      </div>
      <p className="error">{errors.search?.message}</p>
    </form>
  );
}
