import classNames from 'classnames';
import { getImageFullPath } from '@utils/image-path';

export const CourseCard = ({ course, className, onClick }) => (
  <div
    className={classNames(
      'cursor-pointer course-card overflow-hidden transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl flex flex-col rounded-lg bg-white shadow-sm border shadow-slate-300 lg:min-w-[370px] max-w-[370px] min-w-[275px]',
      className
    )}
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    key={course.id}
  >
    <div className="bg-opacity-75 hover:bg-opacity-100 overflow-hidden rounded-lg px-4 py-3 pb-0">
      <img
        src={getImageFullPath(course.image)}
        alt={course.name}
        className="object-cover bg-slate-100 rounded-2xl w-[340px] h-40"
      />
    </div>
    <div className="p-4 pt-2 pb-1 text-gray-600">
      <h3 className="text-lg font-semibold mb-2 line-clamp-2">{course.name}</h3>
      <p className="text-md text-gray-500 mb-4 line-clamp-3">{course.description || '----'}</p>
      <div className="text-md mb-2 border-t border-blue-grey-300 pt-4 flex justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex gap-1 items-center text-start">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-building-bank"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#874900"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M3 21l18 0" />
                <path d="M3 10l18 0" />
                <path d="M5 6l7 -3l7 3" />
                <path d="M4 10l0 11" />
                <path d="M20 10l0 11" />
                <path d="M8 14l0 3" />
                <path d="M12 14l0 3" />
                <path d="M16 14l0 3" />
              </svg>
            </span>
            <span className="line-clamp-1">{course.universities?.join(', ') || '----'}</span>
          </div>

          <div className="flex gap-1 items-center">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-book"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#874900"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
                <path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
                <path d="M3 6l0 13" />
                <path d="M12 6l0 13" />
                <path d="M21 6l0 13" />
              </svg>
            </span>
            {course.lessonsCount || 0}
          </div>

          <div className="flex gap-1 items-center">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-book"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#874900"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                <path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855" />
              </svg>
            </span>
            {course.instructorName}
          </div>
        </div>
        {(course.price || course.discountPrice) && (
          <div className="text-lg text-end content-end basis-1/3">
            {course.discountPrice ? (
              <span className="flex flex-col gap-1">
                <span className="font-bold">{course.discountPrice} JD</span>
                <span className="line-through text-gray-400">{course.price} JD</span>
              </span>
            ) : (
              <span>{course.price} JD</span>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
);
