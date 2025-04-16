import { universitiesSectionThunks } from '@/services/admin-services/admin-content-management.service';
import { selectUniversitiesSection } from '@/slices/admin-slices/content-management-slices/universities-section.slice';
import { Loader } from '@shared/components';
import { PickList } from 'primereact/picklist';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export function UniversitiesSection({ universities }) {
  const dispatch = useDispatch();
  const universitiesSection = useSelector(selectUniversitiesSection);

  const [source, setSource] = useState([]);
  const [target, setTarget] = useState(universitiesSection?.universities);

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
    if (universitiesSection?.instructors?.length) {
      return;
    }
    dispatch(universitiesSectionThunks.get());
  }, []);

  useEffect(() => {
    setTarget(universitiesSection.universities);
  }, [universitiesSection.universities]);

  useEffect(() => {
    const filteredUniversities = universities
      .filter((user) => !target.some((targetItem) => targetItem.universityId === user.id))
      .filter((e) => e.id);

    setSource(filteredUniversities);
  }, [target]);

  function handleRemoveUniversity(event) {
    const universityId = event.value.find((e) => e.id)?.id;
    dispatch(universitiesSectionThunks.delete(universityId));
  }

  function handleAddUniversity(event) {
    const universityId = event.value[0]?.id;
    const maxOrder = target?.length ? Math.max(...target.map((item) => item.order)) + 1 : 1;

    dispatch(
      universitiesSectionThunks.create({
        universityId,
        order: maxOrder
      })
    );
  }

  return (
    <div className="flex flex-col gap-2 relative">
      <h4 className="text-lg text-gray-200 font-semibold">Universities Section</h4>
      <p className="text-gray-400">Pick the universities you want to display</p>
      {universitiesSection.loading && (
        <div className="absolute flex justify-center items-center z-10 bg-slate-600/15 w-full h-full pointer-events-none">
          <Loader />
        </div>
      )}
      {!universitiesSection.loading && (
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
            sourceHeader="Available Universities"
            targetHeader="Selected Universities"
            sourceStyle={{ height: '20rem' }}
            targetStyle={{ height: '20rem' }}
            sourceFilterPlaceholder="Search by name"
            targetFilterPlaceholder="Search by name"
            showTargetControls={false}
            onMoveToTarget={handleAddUniversity}
            onMoveToSource={handleRemoveUniversity}
          />
        </div>
      )}
    </div>
  );
}
