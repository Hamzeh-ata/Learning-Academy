import emptyCoursesList from '@assets/images/empty-results.svg';
import { getCategoriesByFilters } from '@services/client-services/categories-filter.service';
import { CourseLoader, FeatherIcon } from '@shared/components';
import {
  selectFilteredCategories,
  selectLoader,
  selectPaginationData
} from '@slices/client-slices/categories-filter.slice';
import { useDebounce } from '@uidotdev/usehooks';
import { getImageFullPath } from '@utils/image-path';
import { InputText } from 'primereact/inputtext';
import { Paginator } from 'primereact/paginator';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Categories = () => {
  const dispatch = useDispatch();
  const reduxPagination = useSelector(selectPaginationData);
  const categories = useSelector(selectFilteredCategories);
  const isLoading = useSelector(selectLoader);

  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState(reduxPagination);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const previousValues = useRef({ debouncedSearchTerm, pagination });

  useEffect(() => {
    setPagination(reduxPagination);
  }, [reduxPagination]);

  useEffect(() => {
    if (categories.length || isLoading || debouncedSearchTerm) {
      return;
    }
    dispatch(getCategoriesByFilters({ ...pagination }));
  }, [categories, isLoading || debouncedSearchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm !== previousValues.current.debouncedSearchTerm) {
      dispatch(getCategoriesByFilters({ ...pagination, name: debouncedSearchTerm }));
      previousValues.current = { debouncedSearchTerm, pagination };
    }
  }, [debouncedSearchTerm, dispatch, pagination]);

  const onPageChange = useCallback(
    (event) => {
      const newPagination = { ...pagination, first: event.first, pageNumber: event.page + 1, pageSize: event.rows };
      setPagination(newPagination);
      dispatch(getCategoriesByFilters({ ...newPagination, name: debouncedSearchTerm }));
    },
    [pagination, dispatch]
  );

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearInput = () => {
    setSearchTerm('');
  };

  return (
    <div className="px-4 md:px-26 xl:px-40 py-4 xl:py-8 flex-1">
      <div className="flex flex-col gap-2">
        <div className="bg-white rounded-lg shadow-md my-2 p-6">
          <div className="flex justify-between flex-wrap">
            <h3 className="text-xl font-semibold">Categories List</h3>
            <p className="text-lg">{pagination.totalCount} Categories found</p>
          </div>
          <div className="w-full flex relative items-center gap-4 justify-between mt-4 flex-wrap">
            <div className="flex-1 relative min-w-[80%]">
              <span className="absolute left-2 top-1/2 bottom-1 transform -translate-y-1/2 text-gray-400">
                <FeatherIcon name="Search" size="18" />
              </span>
              <InputText
                placeholder="Search categories..."
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
        </div>
        <div className="bg-white rounded-lg shadow-md my-2 p-6">
          {isLoading && (
            <div className="flex justify-center h-full mb-2">
              <CourseLoader />
            </div>
          )}
          {!isLoading && !categories?.length && (
            <div className="flex flex-col justify-center items-center">
              <p className="text-gray-600 mb-2">No Result Found</p>
              <img src={emptyCoursesList} alt="empty courses" />
            </div>
          )}
          {!isLoading && !!categories?.length && (
            <>
              <div className="flex flex-wrap gap-4 justify-center pt-2 pb-4 px-2">
                {categories?.map((category) => (
                  <div
                    className="flex flex-col rounded-lg bg-white shadow-md border w-[370px] overflow-hidden"
                    key={category.id}
                  >
                    <div className="overflow-hidden w-full">
                      <img
                        src={getImageFullPath(category.image)}
                        alt={category.name}
                        className="object-cover bg-slate-100 w-full h-44"
                      />
                    </div>
                    <div className="p-4 pt-2 pb-1 text-gray-600 flex-wrap flex flex-col overflow-hidden w-full">
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2 word-break">{category.name}</h3>
                      <p className="text-md text-gray-500 mb-4 line-clamp-4 word-break">
                        {category.description || '----'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="py-2 border-t border-blue-grey-300">
                <Paginator
                  first={pagination.first}
                  rows={pagination.pageSize}
                  totalRecords={pagination.totalCount}
                  rowsPerPageOptions={[10, 20, 30]}
                  onPageChange={onPageChange}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
