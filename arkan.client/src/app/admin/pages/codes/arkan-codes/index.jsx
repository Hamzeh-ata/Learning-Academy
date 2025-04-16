import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePermissionCheck } from '@hooks';
import { arkanCodesThunks, selectAllArkanCodes } from '@/slices/admin-slices/codes-slices/arkan-code.slice';
import { PlusIcon, SidebarPanel } from '@shared/components';
import { ArkanCodesEntry, ArkanCodesList } from '@/app/admin/features/codes';

const ArkanCodes = () => {
  const dispatch = useDispatch();
  const [selectedCode, setSelectedCode] = useState(null);
  const { create } = usePermissionCheck();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const arkanCodesList = useSelector(selectAllArkanCodes);

  const resetForm = () => {
    setSelectedCode(null);
    setIsModalOpen(false);
  };

  const handleEditArkanCode = (arkanCode) => {
    setSelectedCode(arkanCode);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (arkanCodesList.length === 0) {
      dispatch(arkanCodesThunks.fetchAll());
    }
  }, []);

  const Header = () => (
    <div className="flex justify-between mb-4 text-slate-200">
      <div className="text-lg">Arkan Codes List</div>
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
      <Header />
      <ArkanCodesList arkanCodes={arkanCodesList} setSelectCode={handleEditArkanCode} />
      <SidebarPanel
        isVisible={isModalOpen}
        position={'right'}
        onHide={resetForm}
        isDismissible
        title={`${selectedCode ? 'Update' : 'Add'} Arkan Code`}
      >
        <ArkanCodesEntry arkanCode={selectedCode} onSubmitted={resetForm} />
      </SidebarPanel>
    </>
  );
};
export default ArkanCodes;
