import { TabComponent, TabsCard, UsersIcon } from '@shared/components';
import { Admins } from './tabs/admins';
import { Instructors } from './tabs/instructors';
import { Students } from './tabs/students';
import { usePermissions } from '@/contexts/permission-context';
import './users-management.css';
import { ForbiddenPage } from '@/app/public/pages/forbidden-page';

function UsersManagement() {
  const { getPermissionsForPage } = usePermissions();

  const tabs = [
    { title: 'Admins', catalogComponent: Admins, permission: getPermissionsForPage('admins')?.view },
    { title: 'Instructors', catalogComponent: Instructors, permission: getPermissionsForPage('Instructors')?.view },
    { title: 'Students', catalogComponent: Students, permission: getPermissionsForPage('Students')?.view }
  ];

  const firstTabWithPermission = tabs.findIndex(({ permission }) => permission);

  if (firstTabWithPermission === -1) {
    return <ForbiddenPage />;
  }
  return (
    <TabsCard activeTabIndex={firstTabWithPermission} title="Users Management" icon={UsersIcon}>
      {tabs.map(
        ({ title, catalogComponent, permission }, index) =>
          permission && (
            <TabComponent key={index} tabTitle={title}>
              {catalogComponent()}
            </TabComponent>
          )
      )}
    </TabsCard>
  );
}

export default UsersManagement;
