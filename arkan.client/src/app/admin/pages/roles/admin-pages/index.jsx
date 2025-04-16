import { PagesList, PageEntry } from '@(admin)/features/roles';
import { Modal } from '@shared/components';
import { useDispatch } from 'react-redux';
import { fetchPages } from '@services/permission-services/pages.service';

export const AdminPages = ({ isModalOpen, setIsModalOpen }) => {
  const dispatch = useDispatch();

  const resetForm = () => {
    setIsModalOpen(false);
  };

  const handleSubmittedPage = () => {
    dispatch(fetchPages());
    resetForm();
  };

  return (
    <>
      <div>
        <PagesList />
      </div>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={resetForm}>
          <PageEntry onSubmitted={handleSubmittedPage} />
        </Modal>
      )}
    </>
  );
};
