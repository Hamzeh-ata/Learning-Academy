import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePermissionCheck } from '@hooks';
import { promoCodeThunks, selectAllPromoCodes } from '@/slices/admin-slices/codes-slices/promo-code.slice';
import { PlusIcon, SidebarPanel } from '@shared/components';
import { PromoCodesEntry, PromoCodesList } from '@/app/admin/features/codes';

const PromoCodes = () => {
  const dispatch = useDispatch();
  const [selectedCode, setSelectedCode] = useState(null);
  const { create } = usePermissionCheck();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const promoCodesList = useSelector(selectAllPromoCodes);

  const resetForm = () => {
    setSelectedCode(null);
    setIsModalOpen(false);
  };

  const handleEditPromoCode = (promoCode) => {
    setSelectedCode(promoCode);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (promoCodesList.length === 0) {
      dispatch(promoCodeThunks.fetchAll());
    }
  }, []);

  const Header = () => (
    <div className="flex justify-between mb-4 text-slate-200">
      <div className="text-lg">Promo Codes List</div>
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
      <PromoCodesList promoCodes={promoCodesList} setSelectCode={handleEditPromoCode} />
      <SidebarPanel
        isVisible={isModalOpen}
        position={'right'}
        onHide={resetForm}
        isDismissible
        title={`${selectedCode ? 'Update' : 'Add'} Promo Code`}
      >
        <PromoCodesEntry promoCode={selectedCode} onSubmitted={resetForm} />
      </SidebarPanel>
    </>
  );
};
export default PromoCodes;
