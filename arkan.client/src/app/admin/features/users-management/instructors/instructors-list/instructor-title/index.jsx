import { Tooltip } from 'primereact/tooltip';
import { getImageFullPath } from '@utils/image-path';

export const InstructorTitle = ({ title, id, image }) => (
  <div className="flex items-center gap-4 max-w-[30rem]">
    <img className="rounded-full shadow-xl w-12 h-12 object-fill" src={getImageFullPath(image)} alt={'instructor'} />
    <Tooltip target={`.instructor-title-${id}`}>
      <p className="flex text-left text-md max-w-56 w-fit">{title}</p>
    </Tooltip>
    <p className={`line-clamp-2 break-all instructor-title-${id}`}>{title}</p>
  </div>
);
