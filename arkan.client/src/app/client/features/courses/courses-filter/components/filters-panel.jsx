import { Dropdown } from 'primereact/dropdown';
import classNames from 'classnames';
import { useClickAway } from '@uidotdev/usehooks';
import { DROP_DOWN_TYPES } from '@constants';
import { useDropdownData } from '@hooks';

export const FiltersPanel = ({ filters, setFilters, showFilters, setShowFilters }) => {
  const { universities, categories, packages, instructors } = useDropdownData([
    DROP_DOWN_TYPES.Instructors,
    DROP_DOWN_TYPES.Categories,
    DROP_DOWN_TYPES.Packages,
    DROP_DOWN_TYPES.Universities
  ]);

  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilters((f) => ({ ...f, [name]: value }));
  }

  const ref = useClickAway(() => {
    setShowFilters(false);
  });

  const panelClasses = classNames(
    'bg-white border rounded-lg shadow-lg top-14 w-3/4 lg:w-1/3 p-6 absolute z-10 right-0 transition-all',
    {
      'visible opacity-100 animate-fade-down': showFilters, // Enter animation
      'invisible opacity-0 delay-300 animate-flip-down animate-alternate-reverse': !showFilters // Exit animation
    }
  );

  return (
    <div className={panelClasses} ref={ref}>
      <h3 className="text-lg font-semibold">Filters</h3>

      <div className="flex flex-col mt-1 gap-4">
        <div className="mb-2 field">
          <label>University</label>
          <Dropdown
            name="universityId"
            value={filters.universityId}
            optionValue="id"
            optionLabel="name"
            options={universities}
            appendTo={'self'}
            onChange={handleFilterChange}
            placeholder="Select University"
          />
        </div>
        <div className="mb-2 field">
          <label>Package</label>
          <Dropdown
            name="packageId"
            value={filters.packageId}
            optionValue="id"
            optionLabel="name"
            appendTo={'self'}
            options={packages}
            onChange={handleFilterChange}
            placeholder="Select Package"
          />
        </div>
        <div className="mb-2 field">
          <label>Category</label>
          <Dropdown
            name="categoryId"
            value={filters.categoryId}
            optionValue="id"
            optionLabel="name"
            appendTo={'self'}
            options={categories}
            onChange={handleFilterChange}
            placeholder="Select Category"
          />
        </div>
        <div className="mb-2 field">
          <label>Instructor</label>
          <Dropdown
            name="instructorId"
            value={filters.instructorId}
            optionValue="id"
            appendTo={'self'}
            optionLabel="name"
            options={instructors}
            onChange={handleFilterChange}
            placeholder="Select Instructor"
          />
        </div>
      </div>
    </div>
  );
};
