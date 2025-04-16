import { ForbiddenPage } from '@/app/public/pages/forbidden-page';
import { usePermissions } from '@/contexts/permission-context';
import { CategoryIcon, TabComponent, TabsCard } from '@shared/components';
import './catalog-management.css';
import { AdminPackages } from './tabs/admin-packages';
import { Categories } from './tabs/categories';
import Courses from './tabs/courses';
import { Universities } from './tabs/universities';

function CatalogManagement() {
  const { getPermissionsForPage } = usePermissions();

  const tabs = [
    { title: 'Courses', catalogComponent: Courses, permission: getPermissionsForPage('courses')?.view },
    { title: 'Categories', catalogComponent: Categories, permission: getPermissionsForPage('categories')?.view },
    { title: 'Packages', catalogComponent: AdminPackages, permission: getPermissionsForPage('packages')?.view },
    { title: 'Universities', catalogComponent: Universities, permission: getPermissionsForPage('universities')?.view }
  ];

  const firstTabWithPermission = tabs.findIndex(({ permission }) => permission);

  if (firstTabWithPermission === -1) {
    return <ForbiddenPage />;
  }
  return (
    <TabsCard activeTabIndex={firstTabWithPermission} title="Catalog Management" icon={CategoryIcon}>
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

export default CatalogManagement;
