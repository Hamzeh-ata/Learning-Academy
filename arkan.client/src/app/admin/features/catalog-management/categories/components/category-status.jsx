import { Tooltip } from 'primereact/tooltip';

export const CategoryStatus = ({ status, id }) => (
  <>
    <Tooltip target={`.category-status-${id}`}>
      <div className="flex text-left max-w-48">{status ? 'Enabled' : 'Disabled'}</div>
    </Tooltip>
    <span
      className={`w-5 h-5 block rounded-full shadow-2xl category-status-${id} ${status ? 'bg-green-400' : 'bg-red-400'}`}
    ></span>
  </>
);
