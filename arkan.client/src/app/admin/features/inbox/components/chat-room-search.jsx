import { useEffect, useState } from 'react';
import { useDebounce } from '@uidotdev/usehooks';

export function ChatRoomSearch({ onSearch }) {
  const [value, setValue] = useState('');
  const debouncedSearchTerm = useDebounce(value, 500);

  function resetSearch() {
    setValue('');
  }

  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <div className="relative">
      <button className="absolute z-10 left-1 -translate-y-1/2 top-1/2 p-2">
        <svg
          className="w-5 h-5 text-gray-500"
          aria-labelledby="search"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          height="20"
          width="35"
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
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search..."
        className="rounded-2xl shadow-sm text-gray-200 focus:shadow-md px-8 py-3 bg-slate-800 focus:outline-none focus:bg-slate-700 w-full placeholder-gray-400"
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
}
