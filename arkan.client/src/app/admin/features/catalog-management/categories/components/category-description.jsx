import { Tooltip } from 'primereact/tooltip';

export const CategoryDescription = ({ description, id }) => (
  <>
    <Tooltip target={`.category-desc-${id}`}>
      <p className="flex text-left max-w-48 text-md">{description}</p>
    </Tooltip>
    <p className={`line-clamp-2 max-w-56 w-fit break-all category-desc-${id}`}>{description}</p>
  </>
);
