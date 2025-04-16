import { Dropdown } from 'primereact/dropdown';
import { selectPaginationData, selectLoading } from '@/slices/admin-slices/course-management-slices/chapters.slice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChapters } from '@/services/admin-services/course-management-services/chapters.service';
import { usePermissionCheck } from '@hooks';
import classNames from 'classnames';

export const SelectChapter = ({
  selectedChapterId,
  setSelectedChapterId,
  chapters,
  setShowAddLesson,
  courseId,
  showAddLesson = true,
  className = '',
  containerClassName = ''
}) => {
  const dispatch = useDispatch();

  const paginationData = useSelector(selectPaginationData);
  const loading = useSelector(selectLoading);
  const { create } = usePermissionCheck();

  const onLazyLoad = (event) => {
    const currentlyLoadedItems = event.first + 10;
    if (paginationData.totalPages !== 1) {
      dispatch(fetchChapters({ currentPage: 1, pageSize: currentlyLoadedItems, courseId }));
    }
  };

  return (
    <div className={classNames('field', containerClassName)}>
      <label>Chapter</label>
      <Dropdown
        value={selectedChapterId}
        optionLabel="name"
        optionValue="id"
        placeholder="Select a chapter"
        itemTemplate={chapterOptionTemplate}
        className={classNames('bg-slate-700 py-1 rounded-md pl-3 break-all truncate max-w-[250px]', className)}
        options={chapters}
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
        onChange={(e) => setSelectedChapterId(e.value)}
      />
      {selectedChapterId && create && showAddLesson && (
        <button className="btn primary ms-4" onClick={() => setShowAddLesson(true)}>
          Add Lesson
        </button>
      )}
    </div>
  );
};
const chapterOptionTemplate = (option) => (
  <div className="flex items-center w-full justify-between">
    <div className="flex gap-2 items-center">
      <div className="break-all truncate max-w-[200px]">{option.name}</div>
    </div>
  </div>
);
