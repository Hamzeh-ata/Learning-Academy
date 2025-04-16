import '@assets/transitions.css';
import { usePermissions } from '@contexts/permission-context';
import { usePermissionCheck } from '@hooks';
import { selectPagePermissions } from '@slices/auth/auth.slice';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import WithRouteAnimation from '../animations/route-animation';
import { AdminNavbar } from '../features/navbar';
import { Sidebar } from '../features/sidebar';
import './admin-layout.css';
import { useSubscribeToTopic } from '@/hooks/useSubscribeToTopic';
import { SOCKET_TOPICS } from '@/constants';
import { ForbiddenPage } from '@/app/public/pages/forbidden-page';

export const AdminLayout = () => {
  const pagePermissions = useSelector(selectPagePermissions);
  const { updatePermissions } = usePermissions();
  const { view } = usePermissionCheck();

  useSubscribeToTopic(SOCKET_TOPICS.ADMIN);

  useEffect(() => {
    document.body.classList.add('admin-layout');

    return () => {
      document?.body?.classList?.remove('admin-layout');
    };
  }, []);

  useEffect(() => {
    updatePermissions(pagePermissions);
  }, [pagePermissions, updatePermissions]);

  return (
    <div className="flex admin-layout">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gray-900 rounded-tl-4xl rounded-bl-4xl px-10">
        <AdminNavbar />
        <WithRouteAnimation>
          {!view && <ForbiddenPage />}
          {view && <Outlet />}
        </WithRouteAnimation>
      </div>
    </div>
  );
};
