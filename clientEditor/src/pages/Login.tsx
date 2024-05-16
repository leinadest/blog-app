import * as yup from 'yup';

import Layout from '../components/layout/Layout';
import authService from '../services/authService';
import backendService from '../services/backendService';
import { useForm } from 'react-hook-form';
import useProfile from '../hooks/useProfile';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';

interface FormValues {
  email?: string;
  password?: string;
}

const validationSchema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

export default function Login() {
  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: yupResolver(validationSchema),
  });
  const { register, handleSubmit, formState, setError } = form;
  const { errors, isSubmitting } = formState;
  const { setProfile } = useProfile();
  const navigate = useNavigate();

  function onSubmit(data: FormValues) {
    const { username, password } = data as Record<string, string>;

    async function login() {
      try {
        const res = await authService.login(username, password);
        if (res.status === 'error' && res.message.match('username')) {
          setError('username', {
            type: 'manual',
            message: 'Username is incorrect',
          });
        }
        if (res.status === 'error' && res.message.match('password')) {
          setError('password', {
            type: 'manual',
            message: 'Password is incorrect',
          });
        }
        if (res.status === 'error') {
          return;
        }
        authService.setToken(res.data);
        const user = (await backendService.getUser()).data;
        setProfile(user);
        navigate('/');
      } catch (err) {
        console.error(err);
      }
    }

    login();
  }

  return (
    <Layout>
      <main>
        <h2>Log In</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control">
            <label htmlFor="username">Username: </label>
            <input type="text" id="username" {...register('username')} />
            <p className="error">{errors.username?.message}</p>
          </div>
          <div className="form-control">
            <label htmlFor="password">Password: </label>
            <input type="password" id="password" {...register('password')} />
            <p className="error">{errors.password?.message}</p>
          </div>
          <button disabled={isSubmitting}>Submit</button>
        </form>
      </main>
    </Layout>
  );
}
