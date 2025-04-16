import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { TextInput } from '@shared/components/form-elements';
import { useNavigate } from 'react-router-dom';
import forgotPasswordImage from '@assets/icons/forgot-password.svg';
import { requestNewPassword } from '@/services/client-services/forgot-password.service';
import alertService from '@/services/alert/alert.service';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setApiError('');
      await dispatch(requestNewPassword({ email: data.email, password: data.password })).unwrap();
      setEmailSent(true);
      alertService.showAlert({
        type: 'success',
        title: 'Password reset request sent.',
        body: 'Please wait for an Admin to approve your request'
      });
    } catch (err) {
      setApiError(err?.key);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap">
      <div className="w-full lg:w-1/2 rounded-lg flex px-5 md:px-20 py-2 lg:py-10 justify-center flex-col items-center h-screen">
        <div className="flex flex-col items-center w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="60"
            height="60"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#874900"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M17 8c.788 1 1 2 1 3v1" />
            <path d="M9 11c0 -1.578 1.343 -3 3 -3s3 1.422 3 3v2" />
            <path d="M12 11v2" />
            <path d="M6 12v-1.397c-.006 -1.999 1.136 -3.849 2.993 -4.85a6.385 6.385 0 0 1 6.007 -.005" />
            <path d="M12 17v4" />
            <path d="M10 20l4 -2" />
            <path d="M10 18l4 2" />
            <path d="M5 17v4" />
            <path d="M3 20l4 -2" />
            <path d="M3 18l4 2" />
            <path d="M19 17v4" />
            <path d="M17 20l4 -2" />
            <path d="M17 18l4 2" />
          </svg>

          <span className="text-xl text-gray-800 font-bold mt-2">Request Password Change</span>
        </div>
        <div className="w-full mt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" autoComplete="off">
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
              label="New password"
              autoComplete="current-password"
              id="password"
              inputClassName={`${apiError && 'animate-shake border-red-500 border'}`}
              error={errors.password}
              register={register('password', {
                required: 'password is required',
                validate: {
                  nonAlphanumeric: (value) =>
                    /[\W_]+/.test(value) || 'Password requires at least one non-alphanumeric character',
                  lowerCase: (value) => /[a-z]+/.test(value) || 'Password requires at least one lowercase letter',
                  upperCase: (value) => /[A-Z]+/.test(value) || 'Password requires at least one uppercase letter'
                },
                onBlur: () => setApiError('')
              })}
            />

            {apiError && <p className="text-red-500">{apiError}</p>}
            {!emailSent && (
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
                  Submit Reset Request
                </button>
              </div>
            )}
          </form>
          <div className="flex gap-1 justify-center mt-4">
            <p className="text-arkan font-bold cursor-pointer hover:underline" onClick={() => navigate('/login')}>
              Back to Login
            </p>
          </div>
        </div>
      </div>
      <div className="bg-arkan w-1/2 hidden lg:flex flex-col items-end justify-end h-screen">
        <img src={forgotPasswordImage} alt="login page" className="px-4" />
      </div>
    </div>
  );
}
