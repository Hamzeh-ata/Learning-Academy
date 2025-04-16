import { Dropdown } from 'primereact/dropdown';
import { fetchCourses } from '@/services/admin-services/catalog-management-services/course.service';
import { selectPaginationData, selectLoading } from '@/slices/admin-slices/catalog-management-slices/courses.slice';
import { useDispatch, useSelector } from 'react-redux';
import { usePermissionCheck } from '@hooks';
import classNames from 'classnames';
import { getImageFullPath } from '@utils/image-path';

export const SelectCourse = ({
  selectedCourseId,
  setSelectedCourseId,
  courses,
  setShowAddChapter,
  isAddBtnVisible = true,
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
      dispatch(fetchCourses({ currentPage: 1, pageSize: currentlyLoadedItems }));
    }
  };

  return (
    <div className={classNames('field', containerClassName)}>
      <label>Course</label>
      <Dropdown
        value={selectedCourseId}
        optionLabel="name"
        optionValue="id"
        itemTemplate={courseOptionTemplate}
        placeholder="Select a course"
        className={classNames('bg-slate-700 py-1 rounded-md pl-3', className)}
        options={courses}
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
        onChange={(e) => setSelectedCourseId(e.value)}
      />
      {selectedCourseId && isAddBtnVisible && create && (
        <button className="btn primary ms-4" onClick={() => setShowAddChapter(true)}>
          Add Chapter
        </button>
      )}
    </div>
  );
};

const courseOptionTemplate = (option) => (
  <div className="flex items-center w-full justify-between">
    <div className="flex gap-2 items-center">
      <img
        alt={option.name}
        src={getImageFullPath(option.image)}
        className="rounded-md w-8 h-8 object-fill break-all truncate max-w-[120px]"
      />
      <div className="break-all truncate max-w-[260px]">{option.name}</div>
    </div>
  </div>
);
