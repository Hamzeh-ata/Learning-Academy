import { Dropdown } from 'primereact/dropdown';
import { selectPaginationData, selectLoading } from '@/slices/admin-slices/course-management-slices/chapters.slice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLessons } from '@/services/admin-services/course-management-services/lessons.service';
import classNames from 'classnames';

export const SelectLesson = ({
  selectedLessonId,
  setSelectedLessonId,
  lessons,
  chapterId,
  containerClassName = ''
}) => {
  const dispatch = useDispatch();

  const paginationData = useSelector(selectPaginationData);
  const loading = useSelector(selectLoading);

  const onLazyLoad = (event) => {
    const currentlyLoadedItems = event.first + 10;
    if (paginationData.totalPages !== 1) {
      dispatch(fetchLessons({ currentPage: 1, pageSize: currentlyLoadedItems, chapterId }));
    }
  };

  return (
    <div className={classNames('field', containerClassName)}>
      <label>Lesson</label>
      <Dropdown
        value={selectedLessonId}
        optionLabel="name"
        optionValue="id"
        placeholder="Select a Lesson"
        itemTemplate={lessonOptionTemplate}
        className="bg-slate-700 py-1 rounded-md pl-3 "
        options={lessons}
        virtualScrollerOptions={{
          lazy: true,
          autoSize: true,
          onLazyLoad: onLazyLoad,
          itemSize: 65,
          showLoader: true,
          loading: loading,
          appendOnly: true,
          scrollHeight: '300px'
        }}
        onChange={(e) => setSelectedLessonId(e.value)}
      />
    </div>
  );
};
const lessonOptionTemplate = (option) => (
  <div className="flex items-center w-full justify-between">
    <div className="flex gap-2 items-center">
      <div className="break-all truncate max-w-[260px]">{option.name}</div>
    </div>
  </div>
);
