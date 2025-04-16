import { AdminChangePassword, AdminEntry, AdminList } from '@(admin)/features/users-management';
import { fetchAdmins } from '@/services/admin-services/user-services';
import { selectAllAdmins } from '@/slices/admin-slices/user-slices';
import { usePermissionCheck } from '@hooks';
import { fetchRoles } from '@services/admin-services/roles.service';
import { Modal, PlusIcon } from '@shared/components';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const MODAL_VIEWS = {
  NONE: 'NONE',
  ADMIN_ENTRY: 'ADMIN_ENTRY',
  CHANGE_PASSWORD: 'CHANGE_PASSWORD'
};

export const Admins = () => {
  const dispatch = useDispatch();
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [modalView, setModalView] = useState(MODAL_VIEWS.NONE);
  const { create } = usePermissionCheck('admins');

  const admins = useSelector(selectAllAdmins);

  useEffect(() => {
    if (admins?.length === 0) {
      dispatch(fetchAdmins());
      dispatch(fetchRoles());
    }
  }, []);

  const resetForm = () => {
    setSelectedAdmin(null);
    setModalView(MODAL_VIEWS.NONE);
  };

  const handleChangePassword = (admin) => {
    setSelectedAdmin(admin);
    setModalView(MODAL_VIEWS.CHANGE_PASSWORD);
  };

  const handleEditAdmin = (admin) => {
    setSelectedAdmin(admin);
    setModalView(MODAL_VIEWS.ADMIN_ENTRY);
  };

  const AdminsListHeader = () => (
    <div className="flex justify-between mb-6 text-lg font-semibold text-gray-200">
      <div className="">Admins List</div>
      {create && (
        <button
          onClick={() => {
            setModalView(MODAL_VIEWS.ADMIN_ENTRY);
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
      <AdminsListHeader />
      <AdminList admins={admins} setSelectedAdmin={handleEditAdmin} handleChangePassword={handleChangePassword} />

      {modalView !== MODAL_VIEWS.NONE && (
        <Modal isOpen={modalView !== MODAL_VIEWS.NONE} onClose={resetForm}>
          {modalView === MODAL_VIEWS.ADMIN_ENTRY && <AdminEntry admin={selectedAdmin} onSubmitted={resetForm} />}
          {modalView === MODAL_VIEWS.CHANGE_PASSWORD && (
            <AdminChangePassword userId={selectedAdmin?.id} onSubmitted={resetForm} />
          )}
        </Modal>
      )}
    </>
  );
};
