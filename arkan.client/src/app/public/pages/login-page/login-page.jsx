import { LoginForm } from '@/app/public/features/login-page';
import loginPage from '@assets/icons/login-page.svg';
import smileyFace from '@assets/icons/smiley-face.svg';

const LoginPage = () => (
  <div className="flex flex-wrap">
    <div className="w-full lg:w-1/2 rounded-lg flex px-5 md:px-20 py-2 lg:py-10 justify-center flex-col items-center h-screen">
      <div className="flex flex-col items-center w-full">
        <img src={smileyFace} alt="Smiley face" />
        <span className="text-xl text-gray-800 font-bold mt-2">Login To Your Account</span>
      </div>
      <LoginForm />
    </div>
    <div className="bg-arkan w-1/2 hidden lg:flex flex-col items-center justify-center h-screen">
      <img src={loginPage} alt="login page" />
    </div>
  </div>
);

export default LoginPage;
