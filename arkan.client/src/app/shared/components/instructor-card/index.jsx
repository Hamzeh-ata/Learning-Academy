import classNames from 'classnames';
import { getImageFullPath } from '@utils/image-path';
import { FeatherIcon } from '@shared/components/feather-icon';
import { Tooltip } from 'primereact/tooltip';

export const InstructorCard = ({ instructor, onClick, className }) => (
  <div
    className={classNames(
      'cursor-pointer course-card transition duration-300 mb-2 ease-in-out transform hover:-translate-y-1 hover:shadow-xl flex flex-col rounded-lg bg-white shadow-sm border shadow-slate-300 w-[370px]',
      className
    )}
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    key={instructor.id}
  >
    <div className="bg-opacity-75 hover:bg-opacity-100 overflow-hidden rounded-l-lg w-full flex h-full flex-wrap sm:flex-nowrap">
      <img
        src={getImageFullPath(instructor.image)}
        alt={instructor.name}
        className="object-cover bg-slate-100 w-full sm:w-[160px] h-40 sm:h-full"
      />
      <div className="p-4 pt-2 pb-1 text-gray-600 w-full flex flex-col justify-between">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{instructor.name}</h3>
        <p className="text-md text-gray-500 mb-4 line-clamp-3 word-break">{instructor.bio || '----'}</p>
        <div className="text-md mb-2 border-t border-blue-grey-300 pt-4 flex-col flex justify-between gap-2">
          <div className="flex items-center gap-2">
            <FeatherIcon size={16} name="PhoneCall" />
            <span>{instructor.phoneNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            {renderProfileSocialLinks(instructor?.faceBook, 'Facebook')}
            {renderProfileSocialLinks(instructor?.linkedin, 'Linkedin')}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const renderProfileSocialLinks = (value, icon) =>
  value &&
  icon && (
    <>
      <Tooltip target={`.instructor-social-${icon}`}>{icon}</Tooltip>
      <a target="_blank" onClick={(e) => e.stopPropagation()} href={value}>
        {
          <FeatherIcon
            size={18}
            className={`instructor-social-${icon} text-blue-500 hover:text-blue-600 transition-transform duration-300 ease-in-out hover:scale-110`}
            name={icon}
          />
        }
      </a>
    </>
  );
