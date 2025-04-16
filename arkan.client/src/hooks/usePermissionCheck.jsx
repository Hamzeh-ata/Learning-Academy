import { usePermissions } from '@contexts/permission-context';
import { useLocation } from 'react-router';

export const usePermissionCheck = (pageName = '') => {
  const { getPermissionsForPage } = usePermissions();
  const location = useLocation();
  const currentPageName = location.pathname.split('/')[1];
  const permissions = getPermissionsForPage(pageName?.toLowerCase() || currentPageName);

  if (currentPageName === 'admin-home' && !pageName) {
    return { view: true };
  }
  return permissions;
};
