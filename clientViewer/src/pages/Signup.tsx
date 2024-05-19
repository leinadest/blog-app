import * as yup from 'yup';

import Layout from '../components/layout/Layout';
import backendService from '../services/backendService';
import { IUser } from '../types/types';
import authService from '../services/authService';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';

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
    .matches(/^[a-zA-Z0-9]+$/, 'Username must contain only letters or numbers')
    .required('Username is required'),
  email: yup
    .string()
    .email('Email format is invalid')
    .test('unique', 'Email must not be used already', async (value) => {
      const users = (await backendService.getUsers()).data;
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

export default function Signup() {
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

  function onSubmit(data: FormValues) {
    const { username, email, password } = data as Record<string, string>;

    authService
      .signup(username, email, password)
      .then(() => {
        navigate('/success');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <Layout>
      <main>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control">
            <label htmlFor="username">Username: </label>
            <input type="text" id="username" {...register('username')} />
            <p className="error">{errors.username?.message}</p>
          </div>
          <div className="form-control">
            <label htmlFor="email">Email: </label>
            <input type="email" id="email" {...register('email')} />
            <p className="error">{errors.email?.message}</p>
          </div>
          <div className="form-control">
            <label htmlFor="password">Password: </label>
            <input type="password" id="password" {...register('password')} />
            <p className="error">{errors.password?.message}</p>
          </div>
          <div className="form-control">
            <label htmlFor="confirmedPassword">Confirm password: </label>
            <input
              type="password"
              id="confirmedPassword"
              {...register('confirmedPassword')}
            />
            <p className="error">{errors.confirmedPassword?.message}</p>
          </div>
          <button disabled={isSubmitting}>Submit</button>
        </form>
      </main>
    </Layout>
  );
}
