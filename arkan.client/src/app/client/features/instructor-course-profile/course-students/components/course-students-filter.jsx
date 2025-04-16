import { FeatherIcon } from '@shared/components/feather-icon';
import { InputText } from 'primereact/inputtext';

export const CourseStudentsFilters = ({ searchTerm, handleChange, pagination, clearInput }) => (
  <div className="bg-white rounded-lg shadow-md my-2 p-6">
    <div className="flex justify-between flex-wrap">
      <h3 className="text-xl font-semibold">Students List</h3>
      <p className="text-lg">{pagination.totalCount} Students found</p>
    </div>
    <div className="w-full flex items-center gap-4 justify-between mt-4 relative">
      <span className="absolute left-2 top-1/2 bottom-1 transform -translate-y-1/2 text-gray-400">
        <FeatherIcon name="Search" size="18" />
      </span>
      <InputText
        placeholder="Search students by name..."
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
