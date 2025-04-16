import { coursesSectionThunks } from '@/services/admin-services/admin-content-management.service';
import { selectCoursesSection } from '@/slices/admin-slices/content-management-slices/courses-section.slice';
import { PickList } from 'primereact/picklist';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from '@shared/components';

export function CoursesSection({ courses }) {
  const dispatch = useDispatch();
  const coursesSection = useSelector(selectCoursesSection);

  const [source, setSource] = useState([]);
  const [target, setTarget] = useState(coursesSection?.courses);

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
    if (coursesSection?.courses?.length) {
      return;
    }
    dispatch(coursesSectionThunks.get());
  }, []);

  useEffect(() => {
    setTarget(coursesSection.courses);
  }, [coursesSection.courses]);

  useEffect(() => {
    const filteredCourses = courses
      .filter((course) => !target.some((targetItem) => targetItem.courseId === course.id))
      .filter((e) => e.id);

    setSource(filteredCourses);
  }, [target]);

  function handleRemoveCourse(event) {
    const courseId = event.value.find((e) => e.courseId)?.id;
    dispatch(coursesSectionThunks.delete(courseId));
  }

  function handlePushCourse(event) {
    const courseId = event.value[0]?.id;
    const maxOrder = target?.length ? Math.max(...target.map((item) => item.order)) + 1 : 1;

    dispatch(
      coursesSectionThunks.create({
        courseId,
        order: maxOrder
      })
    );
  }

  return (
    <div className="flex flex-col gap-2 relative">
      <h4 className="text-lg text-gray-200 font-semibold">Courses Section</h4>
      <p className="text-gray-400">Pick the courses you want to display</p>
      {coursesSection.loading && (
        <div className="absolute flex justify-center items-center z-10 bg-slate-600/15 w-full h-full pointer-events-none">
          <Loader />
        </div>
      )}
      {!coursesSection.loading && (
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
            sourceHeader="Available Courses"
            targetHeader="Selected Courses"
            sourceStyle={{ height: '20rem' }}
            targetStyle={{ height: '20rem' }}
            sourceFilterPlaceholder="Search by name"
            targetFilterPlaceholder="Search by name"
            showTargetControls={false}
            onMoveToTarget={handlePushCourse}
            onMoveToSource={handleRemoveCourse}
          />
        </div>
      )}
    </div>
  );
}
