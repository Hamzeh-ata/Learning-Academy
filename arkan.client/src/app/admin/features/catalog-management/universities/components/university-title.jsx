import { Tooltip } from 'primereact/tooltip';
import { getImageFullPath } from '@utils/image-path';

export const UniversityTitle = ({ title, id, image }) => (
  <div className="flex items-center gap-4 max-w-[30rem]">
    <img className="rounded-full shadow-xl w-14 h-14 object-fill" src={getImageFullPath(image)} alt={'university'} />
    <Tooltip target={`.university-title-${id}`}>
      <p className="flex text-left text-md max-w-56 w-fit">{title}</p>
    </Tooltip>
    <p className={`line-clamp-2 break-all university-title-${id}`}>{title}</p>
  </div>
);
