import { categoriesSectionThunks } from '@/services/admin-services/admin-content-management.service';
import { selectCategoriesSection } from '@/slices/admin-slices/content-management-slices/categories-section.slice';
import { Loader } from '@shared/components';
import { PickList } from 'primereact/picklist';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export function CategoriesSection({ categories }) {
  const dispatch = useDispatch();
  const categoriesSection = useSelector(selectCategoriesSection);

  const [source, setSource] = useState([]);
  const [target, setTarget] = useState(categoriesSection?.categories);

  const onChange = (event) => {
    setSource(event.source);
    setTarget(event.target);
  };

  const itemTemplate = (item) => (
    <div className="flex flex-wrap p-2 items-center gap-3">
      <span className="font-semibold">{item.name}</span>
    </div>
  );

  useEffect(() => {
    if (categoriesSection?.categories?.length) {
      return;
    }
    dispatch(categoriesSectionThunks.get());
  }, []);

  useEffect(() => {
    setTarget(categoriesSection.categories);
  }, [categoriesSection.categories]);

  useEffect(() => {
    const filteredCategories = categories
      .filter((category) => !target.some((targetItem) => targetItem.categoryId === category.id))
      .filter((e) => e.id);

    setSource(filteredCategories);
  }, [target]);

  function handleRemoveCategory(event) {
    const categoryId = event.value.find((e) => e.id)?.id;
    dispatch(categoriesSectionThunks.delete(categoryId));
  }

  function handleAddCategory(event) {
    const categoryId = event.value[0]?.id;
    const maxOrder = target?.length ? Math.max(...target.map((item) => item.order)) + 1 : 1;

    dispatch(
      categoriesSectionThunks.create({
        categoryId,
        order: maxOrder
      })
    );
  }

  return (
    <div className="flex flex-col gap-2 relative">
      <h4 className="text-lg text-gray-200 font-semibold">Categories Section</h4>
      <p className="text-gray-400">Pick the categories you want to display</p>
      {categoriesSection.loading && (
        <div className="absolute flex justify-center items-center z-10 bg-slate-600/15 w-full h-full pointer-events-none">
          <Loader />
        </div>
      )}
      {!categoriesSection.loading && (
        <div className="px-2 py-4">
          <PickList
            dataKey="id"
            source={source}
            target={target}
            onChange={onChange}
            itemTemplate={itemTemplate}
            filter
            filterBy="name"
            breakpoint="1280px"
            showSourceControls={false}
            sourceHeader="Available Categories"
            targetHeader="Selected Categories"
            sourceStyle={{ height: '20rem' }}
            targetStyle={{ height: '20rem' }}
            sourceFilterPlaceholder="Search by name"
            targetFilterPlaceholder="Search by name"
            showTargetControls={false}
            onMoveToTarget={handleAddCategory}
            onMoveToSource={handleRemoveCategory}
          />
        </div>
      )}
    </div>
  );
}
