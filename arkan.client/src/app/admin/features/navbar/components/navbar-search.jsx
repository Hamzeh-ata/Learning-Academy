import { sidebarRoutes } from '@/app/admin/utils/routes';
import { AutoComplete } from 'primereact/autocomplete';
import { useNavigate } from 'react-router-dom';
import { useState, useCallback } from 'react';

export const NavbarSearch = () => {
  const [items, setItems] = useState(sidebarRoutes);
  const [value, setValue] = useState('');
  const navigate = useNavigate();

  const search = useCallback((event) => {
    const query = event.query?.toLowerCase().trim() || '';
    setItems(
      query
        ? sidebarRoutes.filter(({ label, path, alias }) =>
            [label, path, ...(alias || [])].some((str) => str.toLowerCase().includes(query))
          )
        : sidebarRoutes
    );
  }, []);

  const itemTemplate = (item) => (
    <div className="flex px-4 items-center py-4 gap-4 hover: hover:bg-blue-grey-300 hover:font-semibold hover:text-arkan">
      <span className="h-5 w-5">{item.icon}</span>
      <div className="text-base">{item.label}</div>
    </div>
  );

  function handleSelectionChange(event) {
    navigate(event.value.path);
    resetSearch();
  }

  function resetSearch() {
    setValue('');
    setItems([]);
  }

  return (
    <div className="form relative">
      <button className="absolute z-10 left-1 -translate-y-1/2 top-1/2 p-1">
        <svg
          className="w-5 h-5 text-gray-500"
          aria-labelledby="search"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          height="16"
          width="17"
        >
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="1.333"
            stroke="currentColor"
            d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
          ></path>
        </svg>
      </button>

      <AutoComplete
        field="label"
        inputClassName="input rounded-full shadow-lg px-8 text-white py-3 bg-slate-800 focus:outline-none focus:bg-slate-600 focus:w-full placeholder-gray-400"
        value={value}
        placeholder="Search Pages ..."
        itemTemplate={itemTemplate}
        suggestions={items}
        completeMethod={search}
        onSelect={handleSelectionChange}
        onChange={(e) => setValue(e.value)}
      />
      {!!value && (
        <button
          className="absolute z-10 right-3 -translate-y-1/2 top-1/2 p-1 hover:text-red-500 text-red-400"
          onClick={resetSearch}
        >
          <svg
            stroke="currentColor"
            viewBox="0 0 24 24"
            fill="none"
            className="w-5 h-5 "
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6 18L18 6M6 6l12 12" strokeLinejoin="round" strokeLinecap="round"></path>
          </svg>
        </button>
      )}
    </div>
  );
};
