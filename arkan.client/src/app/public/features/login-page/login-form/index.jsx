import { ADMIN_ROLE, ERROR_MESSAGES } from '@constants';
import { loginUser } from '@services/auth/auth.service';
import { TextInput } from '@shared/components/form-elements';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

export const LoginForm = ({ onLoggedIn }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const result = await dispatch(loginUser(credentials)).unwrap();
      if (result.roles.includes(ADMIN_ROLE)) {
        navigate('/admin-home');
      } else {
        if (onLoggedIn) {
          onLoggedIn();
        } else {
          navigate('/home');
        }
      }
    } catch (err) {
      setApiError(err?.key);
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setApiError('');
    await login(data);
  };

  return (
    <div className="w-full mt-6">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" autoComplete="off">
        <TextInput
          type="email"
          name="email"
          label="Email"
          autoComplete="off"
          id="email"
          error={errors.email}
          inputClassName={`${apiError && 'animate-shake border-red-500 border'}`}
          register={register('email', { required: 'Email is required', onBlur: () => setApiError('') })}
        />

        <TextInput
          type="password"
          name="password"
          label="password"
          autoComplete="current-password"
          id="password"
          inputClassName={`${apiError && 'animate-shake border-red-500 border'}`}
          error={errors.password}
          register={register('password', { required: 'password is required', onBlur: () => setApiError('') })}
        />
        <div className="flex justify-between items-center">
          <p className="text-red-500">{ERROR_MESSAGES[apiError]}</p>
          <p
            className="w-1/2 text-end text-blue-500 hover:underline cursor-pointer"
            onClick={() => navigate('/forgot-password')}
          >
            Forgot password?
          </p>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="w-full flex items-center justify-center text-white p-3 rounded-md bg-arkan hover:bg-arkan-dark"
          >
            {isLoading && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-2 stroke-current w-6 h-6 animate-spin"
                width="44"
                height="44"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#2c3e50"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4.05 11a8 8 0 1 1 .5 4m-.5 5v-5h5" />
              </svg>
            )}
            Login
          </button>
        </div>
        <div className="flex gap-1 justify-center">
          <p> Don`t Have an Account?</p>
          <Link to="/Register" className="text-arkan font-bold cursor-pointer hover:underline">
            <p> Register</p>
          </Link>
        </div>
      </form>
    </div>
  );
};
