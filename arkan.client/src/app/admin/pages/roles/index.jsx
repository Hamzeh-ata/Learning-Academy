import { FeatherIcon, Modal, PlusIcon, TabComponent, TabsCard, SidebarPanel } from '@shared/components';
import { useState } from 'react';
import { useFetchRoles } from '@/app/admin/hooks';
import { RolesList, RoleEntry, RolesPermissions } from '@(admin)/features/roles';
import { useDispatch } from 'react-redux';
import { getPagePermissions } from '@services/admin-services/roles.service';
import { AdminPages } from './admin-pages';

const Roles = () => {
  const roles = useFetchRoles();
  const dispatch = useDispatch();
  const [selectedRole, setSelectedRole] = useState(null);
  const [showViewPermissions, setShowViewPermissions] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);

  const handleEditRole = (role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleViewRole = (role) => {
    dispatch(getPagePermissions(role.id))
      .unwrap()
      .then(() => {
        setSelectedRole(role);
        setShowViewPermissions(true);
      });
  };

  const resetForm = () => {
    setShowViewPermissions(false);
    setIsModalOpen(false);
    setSelectedRole(null);
  };

  const PagesListHeader = () => (
    <div className="flex justify-between">
      <div>Pages List</div>
      <button
        onClick={() => {
          setIsPageModalOpen(true);
        }}
        className="text-orange-500"
      >
        <PlusIcon />
      </button>
    </div>
  );

  const RolesListHeader = () => (
    <div className="flex justify-between">
      <div>Roles List</div>
      <button
        onClick={() => {
          setIsModalOpen(true);
        }}
        className="text-orange-500"
      >
        <PlusIcon />
      </button>
    </div>
  );
  return (
    <div>
      <TabsCard
        title="Roles & Permissions Settings"
        icon={<FeatherIcon size={35} className="text-orange-400" name="Sliders" />}
      >
        <TabComponent title={<RolesListHeader />} tabTitle="Roles">
          <RolesList roles={roles} setSelectedRole={handleEditRole} setViewRole={handleViewRole} />
        </TabComponent>
        <TabComponent title={<PagesListHeader />} tabTitle="Pages">
          <AdminPages setIsModalOpen={setIsPageModalOpen} isModalOpen={isPageModalOpen} />
        </TabComponent>
      </TabsCard>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={resetForm}>
          <RoleEntry role={selectedRole} onSubmitted={resetForm} />
        </Modal>
      )}

      {selectedRole && showViewPermissions && (
        <SidebarPanel
          isVisible={showViewPermissions}
          position={'right'}
          onHide={resetForm}
          isDismissible
          title={selectedRole?.name}
        >
          <RolesPermissions role={selectedRole} onSubmitted={resetForm} />
        </SidebarPanel>
      )}
    </div>
  );
};

export default Roles;
