import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { registerUser } from '@services/auth/auth.service';
import { TextInput } from '@shared/components/form-elements';
import loginPage from '@assets/icons/signup.svg';
import { ADMIN_ROLE, ERROR_MESSAGES } from '@constants';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userType, setUserType] = useState('student');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
    setApiError('');
  };
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const handleRegister = async (userData) => {
    setApiError('');
    try {
      userData.role = userType === 'instructor' ? 'Instructor' : 'Student';

      setIsLoading(true);
      const result = await dispatch(registerUser(userData)).unwrap();
      if (result.roles.includes(ADMIN_ROLE)) {
        navigate('/admin-home');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setApiError(err);
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap">
      <div className="w-full lg:w-1/2 rounded-lg flex px-5 md:px-20 py-2 lg:py-10 justify-center flex-col items-center h-screen">
        <div className="flex flex-col items-center w-full border-gray-700">
          <div className="border border-arkan flex rounded-md overflow-hidden">
            <label
              className={`${userType === 'student' ? 'bg-arkan text-white' : 'bg-white'} py-3 px-4 cursor-pointer`}
            >
              <input
                type="radio"
                value="student"
                className="hidden"
                checked={userType === 'student'}
                onChange={handleUserTypeChange}
              />
              I`m a Student
            </label>
            <label
              className={`${userType === 'instructor' ? 'bg-arkan text-white' : 'bg-white'} py-3 px-4 cursor-pointer`}
            >
              <input
                type="radio"
                value="instructor"
                className="hidden"
                checked={userType === 'instructor'}
                onChange={handleUserTypeChange}
              />
              I`m an Instructor
            </label>
          </div>
        </div>
        <span className="text-xl text-gray-800 font-bold mt-4 mb-1">Fill in your account information</span>
        <div className="w-full">
          <form onSubmit={handleSubmit(handleRegister)} className="flex flex-col gap-6">
            <TextInput
              type="email"
              name="email"
              inputClassName={`${apiError && 'animate-shake border-red-500 border'}`}
              label="Email"
              error={errors.email}
              register={register('email', { required: 'Email is required', onBlur: () => setApiError('') })}
            />
            <div className="flex justify-around mt-4 gap-2">
              <TextInput
                name="firstName"
                label="First Name"
                error={errors.firstName}
                register={register('firstName', { required: 'First Name is required' })}
              />
              <TextInput
                name="lastName"
                label="Last Name"
                error={errors.lastName}
                register={register('lastName', { required: 'Last Name is required' })}
              />
            </div>

            <TextInput
              name="phoneNumber"
              label="Phone Number"
              error={errors.phoneNumber}
              register={register('phoneNumber', { required: 'Phone Number is required' })}
            />

            <TextInput
              type="password"
              name="password"
              label="password"
              autoComplete="off"
              id="password"
              error={errors.password}
              register={register('password', {
                required: 'Password is required.',
                validate: {
                  nonAlphanumeric: (value) =>
                    /[\W_]+/.test(value) || 'Password requires at least one non-alphanumeric character',
                  lowerCase: (value) => /[a-z]+/.test(value) || 'Password requires at least one lowercase letter',
                  upperCase: (value) => /[A-Z]+/.test(value) || 'Password requires at least one uppercase letter'
                }
              })}
            />

            <div className="flex justify-between items-center">
              <p className="text-red-500">{ERROR_MESSAGES[apiError]}</p>
            </div>

            <div className="flex items-center justify-between mt-4">
              <button
                type="submit"
                className="w-full flex items-center justify-center text-white p-3 rounded-md bg-arkan hover:bg-arkan-dark"
              >
                {isLoading && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mx-2 stroke-current w-6 h-6"
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
                Create Account
              </button>
            </div>
          </form>
        </div>

        <div className="mt-4 flex gap-1 flex-wrap">
          <p>Already have an account?</p>
          <Link to="/login" className="text-blue-500 hover:underline">
            Log In
          </Link>
        </div>
      </div>
      <div className="bg-arkan w-1/2 hidden lg:flex flex-col items-center justify-center h-screen">
        <img src={loginPage} alt="login page" />
      </div>
    </div>
  );
};

export default RegisterPage;
