import { FeatherIcon, OrderBy } from '@shared/components';
import classNames from 'classnames';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState } from 'react';
import { FiltersPanel } from './components/filters-panel';
import { useDebounce } from '@uidotdev/usehooks';

export const CoursesFilter = ({ filters, setFilters }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const searchHN = async () => {
      setFilters((f) => ({ ...f, courseName: debouncedSearchTerm }));
    };

    searchHN();
  }, [debouncedSearchTerm, setFilters]);

  const shouldShowClearButton =
    filters.sortBy ||
    filters.courseName ||
    filters.instructorId ||
    filters.categoryId ||
    filters.universityId ||
    filters.packageId;

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  function clearFilters() {
    setSearchTerm('');
    setFilters((f) => ({
      ...f,
      sortBy: '',
      courseName: '',
      instructorId: '',
      categoryId: '',
      universityId: '',
      packageId: ''
    }));
  }

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
          placeholder="Search courses..."
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

      <OrderBy filters={filters} setFilters={setFilters} />

      <button
        onClick={() => {
          setShowFilters(!showFilters);
        }}
      >
        <FeatherIcon
          name="Filter"
          size="20"
          className={classNames({ 'fill-black': showFilters || shouldShowClearButton })}
        />
      </button>

      {shouldShowClearButton && (
        <button onClick={clearFilters} className="p-2 bg-red-500 text-white rounded">
          Clear Filters
        </button>
      )}
      <FiltersPanel
        filters={filters}
        setFilters={setFilters}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />
    </div>
  );
};
