import { PackageEntry, PackagesList } from '@/app/admin/features/catalog-management';
import { usePermissionCheck } from '@hooks';
import { PlusIcon, SidebarPanel } from '@shared/components';
import { packagesThunks, selectAllPackages } from '@/slices/admin-slices/catalog-management-slices/package.slice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const AdminPackages = () => {
  const dispatch = useDispatch();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { create } = usePermissionCheck('packages');
  const packagesList = useSelector(selectAllPackages);

  const resetForm = () => {
    setSelectedPackage(null);
    setIsModalOpen(false);
  };

  const handleEditPackage = (packageObject) => {
    dispatch(packagesThunks.get(packageObject.id));
    setSelectedPackage(packageObject);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (packagesList.length === 0) {
      dispatch(packagesThunks.fetchPaginated({ currentPage: 1, pageSize: 10 }));
    }
  }, []);

  const PackageListHeader = () => (
    <div className="flex justify-between mb-6 text-lg font-semibold text-gray-200">
      <div>📦 Packages List</div>
      {create && (
        <button
          onClick={() => {
            setIsModalOpen(true);
          }}
          className="text-orange-500"
        >
          <PlusIcon />
        </button>
      )}
    </div>
  );

  return (
    <>
      <PackageListHeader />
      <PackagesList setSelectedPackage={handleEditPackage} />
      <SidebarPanel
        isVisible={isModalOpen}
        position={'right'}
        onHide={resetForm}
        isDismissible
        title={`${selectedPackage ? 'Update' : 'Add'} Package`}
      >
        <PackageEntry packageObj={selectedPackage} onSubmitted={resetForm} />
      </SidebarPanel>
    </>
  );
};
