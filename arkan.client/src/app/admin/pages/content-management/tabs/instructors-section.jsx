import { instructorsSectionThunks } from '@/services/admin-services/admin-content-management.service';
import { selectInstructorsSection } from '@/slices/admin-slices/content-management-slices/instructors-section.slice';
import { Loader } from '@shared/components';
import { PickList } from 'primereact/picklist';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export function InstructorsSection({ instructors }) {
  const dispatch = useDispatch();
  const instructorsSection = useSelector(selectInstructorsSection);

  const [source, setSource] = useState([]);
  const [target, setTarget] = useState(instructorsSection?.instructors);

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
    if (instructorsSection?.instructors?.length) {
      return;
    }
    dispatch(instructorsSectionThunks.get());
  }, []);

  useEffect(() => {
    setTarget(instructorsSection.instructors);
  }, [instructorsSection.instructors]);

  useEffect(() => {
    const filteredUsers = instructors
      .filter((user) => !target.some((targetItem) => targetItem.userId === user.userid))
      .filter((e) => e.id);

    setSource(filteredUsers);
  }, [target]);

  function handleRemoveUser(event) {
    const userId = event.value.find((e) => e.userId)?.id;
    dispatch(instructorsSectionThunks.delete(userId));
  }

  function handlePushUser(event) {
    const userId = event.value[0]?.userid;
    const maxOrder = target?.length ? Math.max(...target.map((item) => item.order)) + 1 : 1;

    dispatch(
      instructorsSectionThunks.create({
        userId,
        order: maxOrder
      })
    );
  }

  return (
    <div className="flex flex-col gap-2 relative">
      <h4 className="text-lg text-gray-200 font-semibold">Instructors Section</h4>
      <p className="text-gray-400">Pick the instructors you want to display</p>
      {instructorsSection.loading && (
        <div className="absolute flex justify-center items-center z-10 bg-slate-600/15 w-full h-full pointer-events-none">
          <Loader />
        </div>
      )}
      {!instructorsSection.loading && (
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
            sourceHeader="Available Instructors"
            targetHeader="Selected Instructors"
            sourceStyle={{ height: '20rem' }}
            targetStyle={{ height: '20rem' }}
            sourceFilterPlaceholder="Search by name"
            targetFilterPlaceholder="Search by name"
            showTargetControls={false}
            onMoveToTarget={handlePushUser}
            onMoveToSource={handleRemoveUser}
          />
        </div>
      )}
    </div>
  );
}
