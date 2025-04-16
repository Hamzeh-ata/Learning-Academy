import { FeatherIcon } from '@/app/shared/components';
import { InputText } from 'primereact/inputtext';

export function LiveStreamFilters({ setSearchTerm, searchTerm }) {
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearInput = () => {
    setSearchTerm('');
  };

  return (
    <div className="w-full flex relative items-center gap-4 justify-between mt-4 flex-wrap">
      <div className="flex-1 relative min-w-[80%]">
        <span className="absolute left-2 top-1/2 bottom-1 transform -translate-y-1/2 text-gray-400">
          <FeatherIcon name="Search" size="18" />
        </span>
        <InputText
          placeholder="Search packages..."
          className="w-full py-3 ps-8 transition-all ease-in-out delay-100 duration-300 hover:bg-slate-200 hover:shadow-md px-4 rounded-lg bg-slate-100 ring-0"
          value={searchTerm}
          onChange={handleChange}
        />
        {searchTerm && (
          <button
            onClick={clearInput}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700"
          >
            <FeatherIcon name="XCircle" />
          </button>
        )}
      </div>
    </div>
  );
}
