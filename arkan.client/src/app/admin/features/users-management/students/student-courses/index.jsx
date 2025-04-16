import { fetchStudentCourses } from '@/services/admin-services/user-services';
import { selectAllStudentCourses, selectStudentCoursesPagination } from '@/slices/admin-slices/user-slices';
import { FeatherIcon } from '@shared/components';
import { getImageFullPath } from '@utils/image-path';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Tooltip } from 'primereact/tooltip';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const StudentCourses = ({ selectedCourses, setSelectedCourses, userId }) => {
  const studentCourses = useSelector(selectAllStudentCourses);
  const pagination = useSelector(selectStudentCoursesPagination);

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    pageNumber: 1,
    pageSize: 10,
    first: 0
  });
  const dispatch = useDispatch();

  const handleCourseSelection = (courseId) => {
    if (selectedCourses.includes(courseId)) {
      setSelectedCourses(selectedCourses.filter((id) => id !== courseId));
    } else {
      setSelectedCourses([...selectedCourses, courseId]);
    }
  };

  const filteredCourses = studentCourses.filter((course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onPageChange = (event) => {
    setFilters((f) => ({ ...f, first: event.first, pageNumber: event.page + 1, pageSize: event.rows }));
    dispatch(fetchStudentCourses({ userId: userId, currentPage: event.page + 1, pageSize: event.rows }));
  };

  const isCourseSelected = (courseId) => selectedCourses.includes(courseId);
  const listTemplate = (items) => {
    if (items?.length === 0) {
      return (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">No courses found</p>
        </div>
      );
    }

    let list = items.map((course) => gridItem(course));

    return <div className="flex flex-wrap gap-5 justify-center">{list}</div>;
  };
  const gridItem = (course) => (
    <div className="py-4 bg-slate-700 rounded-lg overflow-hidden text-white shadow-md px-4 mt-4" key={course.id}>
      <div className="flex flex-col items-center gap-3 py-2 mb-2 relative">
        <Button
          className={`rounded-full p-2 absolute top-0 right-0  ${!isCourseSelected(course.id) ? 'bg-red-500' : 'bg-teal-500'}`}
          onClick={() => handleCourseSelection(course.id)}
        >
          <FeatherIcon name={!isCourseSelected(course.id) ? 'Minus' : 'Plus'} />
        </Button>

        <img src={getImageFullPath(course.image)} alt={course.name} className="w-60 h-32 object-fill rounded-md" />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Tooltip target={`.course-name-${course.id}`}>{course.name}</Tooltip>
          <p className={`line-clamp-1 max-w-56 break-all course-name-${course.id} `}>{course.name}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-4">
          <span className="flex items-center gap-3">
            <FeatherIcon size={18} name="Users" />
            {course.studentsCount}
          </span>
          <div className="flex items-center gap-3">
            <FeatherIcon size={18} name="User" />
            <Tooltip target={`.instructor-name-${course.id}`}>{course.instructorName}</Tooltip>
            <p className={`line-clamp-1 max-w-56 break-all course-instructorName-${course.id}`}>
              {course.instructorName ?? 'Unknown'}
            </p>
          </div>
        </div>
        <span className="text-lg">
          {course.discountPrice ? (
            <span className="flex flex-col gap-3 ">
              <span className="price">${course.discountPrice}</span>
              <span className="line-through text-gray-500 mr-2">${course.price}</span>
            </span>
          ) : (
            <span className="price">${course.price}</span>
          )}
        </span>
      </div>
    </div>
  );
  const header = (
    <div className="h-5 w-full">
      <div className="">
        <input
          type="text"
          placeholder="Search courses..."
          className="p-inputtext p-component w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="">
        <Button icon="pi pi-refresh" className="p-button-text" />
      </div>
    </div>
  );

  return (
    <div className="flex w-full">
      <DataView
        value={filteredCourses}
        paginator
        lazy
        gutter
        className="w-full"
        layout="grid"
        listTemplate={listTemplate}
        rowsPerPageOptions={[10, 20, 30]}
        onPage={onPageChange}
        first={filters.first}
        rows={filters.pageSize}
        header={header}
        totalRecords={pagination.totalCount}
      />
    </div>
  );
};
