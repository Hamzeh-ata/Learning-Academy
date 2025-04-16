import { useSelector } from 'react-redux';
import { selectCoursesByCategoryId } from '@/slices/admin-slices/catalog-management-slices/category-courses.slice';
import { useState } from 'react';
import { FeatherIcon } from '@shared/components';
import { getImageFullPath } from '@utils/image-path';

export const CategoryCourses = ({ category }) => {
  const courses = useSelector((state) => selectCoursesByCategoryId(state, category.id));
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = courses.filter((course) => course.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="text-white flex flex-col gap-2">
      <div className="flex items-center gap-2 flex-col">
        {category.image && (
          <img
            className="rounded-xl shadow-xl w-24 h-24 object-fill"
            src={getImageFullPath(category.image)}
            alt={'Category'}
          />
        )}
        <p className={`line-clamp-2 w-fit break-all text-lg category-title-${category.id}`}>{category.name}</p>
      </div>

      <div className="flex flex-col gap-1 mt-2 border-blue-grey-600 shadow-xl border rounded-xl p-2">
        <label className="text-base text-slate-400">Description:</label>
        <div className="flex items-center ms-2 gap-2 p-2 rounded-md">
          <p className="text-md text-gray-300">{category.description}</p>
        </div>
      </div>

      <div className="flex flex-col gap-1 mt-2 border-t border-t-gray-600">
        <div className="flex flex-col items-center gap-2 pt-2 mt-2">
          <div className="w-full mb-2 field !mt-0">
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ul className="flex flex-wrap gap-2 w-full">
            {filteredCourses.map((course) => (
              <li className="h-full w-full" key={course.id}>
                <div className="bg-gray-700 mx-2 p-4 h-full rounded-md shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
                  <h3 className="text-primary text-lg font-semibold mb-2">{course.name}</h3>
                  <p className="text-gray-300 flex items-center gap-2">
                    <FeatherIcon size={14} name="User" />
                    Instructor:
                    <span className="text-teal-300 hover:text-teal-200">{course.instructorName ?? '---'}</span>
                  </p>
                  <p className="text-gray-300 mt-1 flex items-center gap-2">
                    <FeatherIcon size={14} name="Activity" />
                    Status:
                    <span className={`${course.status === 'Active' ? 'text-teal-300' : 'text-red-300'}`}>
                      {course.status}
                    </span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
