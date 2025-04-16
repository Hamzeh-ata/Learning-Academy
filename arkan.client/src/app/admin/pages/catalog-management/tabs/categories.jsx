import { CategoriesList, CategoryCourses, CategoryEntry } from '@/app/admin/features/catalog-management';
import { useFetchCategories } from '@/app/admin/hooks';
import { usePermissionCheck } from '@hooks';
import { fetchCategoryCourses } from '@/services/admin-services/catalog-management-services/category.service';
import { Modal, PlusIcon, SidebarPanel } from '@shared/components';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export const Categories = () => {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCategoryCourses, setShowCategoryCourses] = useState(false);
  const { create } = usePermissionCheck('categories');

  const categories = useFetchCategories();

  const resetForm = () => {
    setSelectedCategory(null);
    setIsModalOpen(false);
    setShowCategoryCourses(false);
  };

  const handleSelectedCategory = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleViewCategoryCourses = (category) => {
    setSelectedCategory(category);
    dispatch(fetchCategoryCourses(category.id));
    setShowCategoryCourses(true);
  };

  const CategoriesListHeader = () => (
    <div className="flex justify-between mb-6 text-lg font-semibold text-gray-200">
      <div>Categories List</div>
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
      <CategoriesListHeader />
      <CategoriesList
        categories={categories}
        setSelectedCategory={handleSelectedCategory}
        viewCategoryCourses={handleViewCategoryCourses}
      />
      <Modal isOpen={isModalOpen} onClose={resetForm}>
        <CategoryEntry category={selectedCategory} onSubmitted={resetForm} />
      </Modal>
      {selectedCategory && showCategoryCourses && (
        <SidebarPanel
          isVisible={showCategoryCourses}
          position={'top'}
          isFullScreen
          onHide={resetForm}
          className="category-sidebar"
          isDismissible
        >
          <CategoryCourses category={selectedCategory} />
        </SidebarPanel>
      )}
    </>
  );
};
