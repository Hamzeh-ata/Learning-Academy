import classNames from 'classnames';
import { getImageFullPath } from '@utils/image-path';

export const PackageCard = ({ packageObj, className, onClick }) => (
  <div
    className={classNames(
      'cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl flex flex-col rounded-lg bg-white shadow-sm border shadow-slate-300 lg:min-w-[370px] max-w-[370px] min-w-[275px]',
      className
    )}
    onClick={(e) => {
      e.preventDefault();
      onClick(packageObj);
    }}
    key={packageObj.id}
  >
    <div className="bg-opacity-75 hover:bg-opacity-100 overflow-hidden rounded-lg px-4 py-3 pb-0">
      <img
        src={getImageFullPath(packageObj.image)}
        alt={packageObj.name}
        className="object-cover bg-slate-100 rounded-2xl w-[340px] h-40"
      />
    </div>
    <div className="p-4 pt-2 pb-1 text-gray-600">
      <h3 className="text-lg font-semibold mb-2 line-clamp-2">{packageObj.name}</h3>
      <p className="text-md text-gray-500 mb-4 line-clamp-3">{packageObj.description || '----'}</p>
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
                <path d="M5 4m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" />
                <path d="M9 4m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" />
                <path d="M5 8h4" />
                <path d="M9 16h4" />
                <path d="M13.803 4.56l2.184 -.53c.562 -.135 1.133 .19 1.282 .732l3.695 13.418a1.02 1.02 0 0 1 -.634 1.219l-.133 .041l-2.184 .53c-.562 .135 -1.133 -.19 -1.282 -.732l-3.695 -13.418a1.02 1.02 0 0 1 .634 -1.219l.133 -.041z" />
                <path d="M14 9l4 -1" />
                <path d="M16 16l3.923 -.98" />
              </svg>
            </span>
            <span className="line-clamp-1">{packageObj.coursesCount}</span>
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
            {packageObj.lessonsCount}
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
            {packageObj.instructors?.join(', ')}
          </div>
        </div>
        <div className="text-lg text-end content-end basis-1/3">
          {packageObj.discountPrice ? (
            <span className="flex flex-col gap-1">
              <span className="font-bold">{packageObj.discountPrice} JD</span>
              <span className="line-through text-gray-400">{packageObj.price} JD</span>
            </span>
          ) : (
            <span>{packageObj.price} JD</span>
          )}
        </div>
      </div>
    </div>
  </div>
);
