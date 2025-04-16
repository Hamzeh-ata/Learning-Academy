import { Modal, PlusIcon } from '@shared/components';
import { useState } from 'react';
import { usePermissionCheck } from '@hooks';
import { UniversitiesList, UniversityEntry } from '@/app/admin/features/catalog-management';
import { useFetchUniversities } from '@/app/admin/hooks';

export const Universities = () => {
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { create } = usePermissionCheck('universities');
  const universities = useFetchUniversities();

  const resetForm = () => {
    setSelectedUniversity(null);
    setIsModalOpen(false);
  };

  const handleSelectedUniversity = (university) => {
    setSelectedUniversity(university);
    setIsModalOpen(true);
  };

  const UniversitiesListHeader = () => (
    <div className="flex justify-between mb-6 text-lg font-semibold text-gray-200">
      <div>Universities List</div>
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
      <UniversitiesListHeader />
      {!universities.length && <p>You don`t have any universities, click on plus to add</p>}
      {!!universities?.length && (
        <UniversitiesList universities={universities} setSelectedUniversity={handleSelectedUniversity} />
      )}
      <Modal isOpen={isModalOpen} onClose={resetForm}>
        <UniversityEntry university={selectedUniversity} onSubmitted={resetForm} />
      </Modal>
    </>
  );
};
