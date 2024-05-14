import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { fetchUsers, fetchSignup } from '../../services/backendService';
import { IUser } from '../../types/types';
import styles from './Form.module.css';

interface FormProps {
  heading: string;
  type: 'signup' | 'login';
}

interface FormValues {
  username?: string;
  email?: string;
  password?: string;
  confirmedPassword?: string;
}

const validationSchema = yup.object({
  username: yup
    .string()
    .min(2, 'Username must have at least two characters')
    .max(50, 'Username must have at most 50 characters')
    .required('Username is required'),
  email: yup
    .string()
    .email('Email format is invalid')
    .test('unique', 'Email must not be used already', async (value) => {
      const users = await fetchUsers();
      const userFound = users.find((user: IUser) => user.email === value);
      return !userFound;
    })
    .required('Email is required'),
  password: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must have at least eight characters, including one lowercase letter, one uppercase letter, one number, and one special character',
    ),
  confirmedPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

export default function Form({ heading, type }: FormProps) {
  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmedPassword: '',
    },
    resolver: yupResolver(validationSchema),
  });
  const { register, handleSubmit, formState } = form;
  const { errors, isSubmitting } = formState;
  const navigate = useNavigate();

  // TODO: upon error, redirect the user to the error page
  function onSubmit(data: FormValues) {
    const { username, email, password } = data as Record<string, string>;
    fetchSignup(username, email, password)
      .then(() => {
        navigate('/success');
      })
      .catch((res) => {
        console.log(res);
      });
  }

  return (
    <div>
      <h2 className={styles.h2}>{heading}</h2>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles['form-control']}>
          <label htmlFor="username">Username: </label>
          <input type="text" id="username" {...register('username')} />
          <p className={styles.error}>{errors.username?.message}</p>
        </div>
        {type === 'signup' && (
          <div className={styles['form-control']}>
            <label htmlFor="email">Email: </label>
            <input type="email" id="email" {...register('email')} />
            <p className={styles.error}>{errors.email?.message}</p>
          </div>
        )}
        <div className={styles['form-control']}>
          <label htmlFor="password">Password: </label>
          <input type="password" id="password" {...register('password')} />
          <p className={styles.error}>{errors.password?.message}</p>
        </div>
        {type === 'signup' && (
          <div className={styles['form-control']}>
            <label htmlFor="confirmedPassword">Confirm password: </label>
            <input
              type="password"
              id="confirmedPassword"
              {...register('confirmedPassword')}
            />
            <p className={styles.error}>{errors.confirmedPassword?.message}</p>
          </div>
        )}
        <button disabled={isSubmitting}>Submit</button>
      </form>
    </div>
  );
}
