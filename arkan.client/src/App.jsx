import { PermissionsProvider } from '@contexts/permission-context';
import { useIsAdmin } from '@hooks';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './app/public/pages/login-page/login-page';
import { NotFoundPage } from './app/public/pages/not-found/index';
import RegistrationPage from './app/public/pages/register-page/register-page';
import { PrimeReactLocale } from './i18n/prime-react-locate';
import { AdminRoutes } from './routes/admin-routes';
import { ClientRoutes } from './routes/client-routes';
import { RoleBasedRedirect } from './routes/role-based-redirect';
import { fetchPages } from './services/permission-services/pages.service';
import { selectUserInfo } from './slices/auth/auth.slice';
import ForgotPassword from './app/public/pages/forgot-password';

function App() {
  const userInfo = useSelector(selectUserInfo);
  const dispatch = useDispatch();
  const isAdmin = useIsAdmin();

  useEffect(() => {
    const locale = window.locale || 'en';
    PrimeReactLocale(locale);
  }, []);

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchPages());
    }
  }, [userInfo, dispatch]);

  return (
    <PermissionsProvider>
      <AnimatePresence>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/Register" element={<RegistrationPage />} />

          {isAdmin && <Route path="*" element={<AdminRoutes />} />}

          {!isAdmin && <Route path="*" element={<ClientRoutes />} />}

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/unauthorized" element={<LoginPage />} />
          <Route path="/" element={<RoleBasedRedirect />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
    </PermissionsProvider>
  );
}

export default App;
