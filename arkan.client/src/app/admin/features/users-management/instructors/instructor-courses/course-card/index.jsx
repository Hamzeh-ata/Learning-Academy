import classNames from 'classnames';
import { FeatherIcon, CourseStatus } from '@shared/components';
import { getImageFullPath } from '@utils/image-path';

export const CourseCard = ({ course, showSelect = false, onSelect, isSelected }) => {
  const handleCardClick = () => {
    if (showSelect) {
      onSelect(course);
    }
  };

  const selectionIndicator = isSelected ? (
    <div
      className="absolute -top-5 -left-5 m-3 z-10 bg-green-500 rounded-full p-2"
      style={{ boxShadow: '0 0 10px #34D399' }}
    >
      <FeatherIcon name="Check" color="white" size={16} />
    </div>
  ) : (
    <div className="absolute -top-5 -left-5 z-10 m-3 border-2 border-dashed border-gray-400 rounded-full p-2 flex items-center justify-center">
      <FeatherIcon name="Plus" color="white" size={12} />
    </div>
  );

  return (
    <div
      className={classNames(
        'relative transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl flex flex-col w-72 rounded-lg shadow-md ',
        { 'cursor-pointer': showSelect }
      )}
      onClick={handleCardClick}
      aria-selected={isSelected}
      key={course.id}
      style={{ maxHeight: '400px' }}
    >
      {showSelect && selectionIndicator}
      <div
        className="relative bg-white bg-opacity-75 hover:bg-opacity-100 overflow-hidden rounded-lg"
        style={{ height: '250px' }}
      >
        <img src={getImageFullPath(course.image)} alt={course.name} className="object-cover w-full h-full" />
      </div>
      <div className="p-4 text-gray-200 bg-slate-700 h-full">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{course.name}</h3>
        <p className="text-md text-gray-300 mb-4 line-clamp-3">{course.description || 'No Description'}</p>
        <div className="text-md mb-2 border-t border-gray-600 pt-2">
          <strong className="text-sm">Students: </strong>
          {course.studentsCount}
        </div>
        <div className="text-md">
          <strong className="text-sm">Status: </strong>
          <CourseStatus status={course.status} />
        </div>
      </div>
    </div>
  );
};
