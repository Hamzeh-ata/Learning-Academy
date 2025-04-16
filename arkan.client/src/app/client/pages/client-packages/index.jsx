import emptyCoursesList from '@assets/images/empty-results.svg';
import { getPackageById, getPackagesByFilters } from '@services/client-services/packages-filter.service';
import { CourseLoader, FeatherIcon, Modal } from '@shared/components';
import { PackageCard } from '@shared/components/package-card';
import {
  selectFilteredPackages,
  selectLoader,
  selectPaginationData
} from '@slices/client-slices/packages-filter.slice';
import { useDebounce } from '@uidotdev/usehooks';
import { InputText } from 'primereact/inputtext';
import { Paginator } from 'primereact/paginator';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ClientPackageDetails } from './client-package-details';
import { useSearchParams } from 'react-router-dom';

const ClientPackages = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const reduxPagination = useSelector(selectPaginationData);
  const packages = useSelector(selectFilteredPackages);
  const isLoading = useSelector(selectLoader);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState(reduxPagination);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const previousValues = useRef({ debouncedSearchTerm, pagination });
  const packageId = searchParams.get('packageId');
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    setPagination(reduxPagination);
  }, [reduxPagination]);

  useEffect(() => {
    if (packages.length || isLoading || debouncedSearchTerm) {
      return;
    }
    dispatch(getPackagesByFilters({ ...pagination }));
  }, [packages, isLoading || debouncedSearchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm !== previousValues.current.debouncedSearchTerm) {
      dispatch(getPackagesByFilters({ ...pagination, name: debouncedSearchTerm }));
      previousValues.current = { debouncedSearchTerm, pagination };
    }
  }, [debouncedSearchTerm, dispatch, pagination]);

  const onPageChange = useCallback(
    (event) => {
      const newPagination = { ...pagination, first: event.first, pageNumber: event.page + 1, pageSize: event.rows };
      setPagination(newPagination);
      dispatch(getPackagesByFilters({ ...newPagination, name: debouncedSearchTerm }));
    },
    [pagination, dispatch]
  );

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearInput = () => {
    setSearchTerm('');
  };

  const handlePackageClick = (packageObj) => {
    dispatch(getPackageById(packageObj.id))
      .unwrap()
      .then((res) => {
        setSelectedPackage(res);
      });
  };

  useEffect(() => {
    if (packageId) {
      dispatch(getPackageById(packageId))
        .unwrap()
        .then((res) => {
          setSelectedPackage(res);
        });
    }
  }, [packageId]);

  return (
    <div className="px-4 md:px-26 xl:px-40 py-4 xl:py-8 flex-1">
      <div className="flex flex-col gap-2">
        <div className="bg-white rounded-lg shadow-md my-2 p-6">
          <div className="flex justify-between flex-wrap">
            <h3 className="text-xl font-semibold">Packages List</h3>
            <p className="text-lg">{pagination.totalCount} Packages found</p>
          </div>
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
        </div>
        <div className="bg-white rounded-lg shadow-md my-2 p-6">
          {isLoading && (
            <div className="flex justify-center h-full mb-2">
              <CourseLoader />
            </div>
          )}
          {!isLoading && !packages?.length && (
            <div className="flex flex-col justify-center items-center">
              <p className="text-gray-600 mb-2">No Result Found</p>
              <img src={emptyCoursesList} alt="empty courses" />
            </div>
          )}
          {!isLoading && !!packages?.length && (
            <>
              <div className="flex flex-wrap gap-4 justify-center pt-2 pb-4 px-2">
                {packages?.map((category) => (
                  <PackageCard packageObj={category} key={category.id} onClick={handlePackageClick} />
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
      <Modal isOpen={selectedPackage?.id} onClose={() => setSelectedPackage(null)}>
        <ClientPackageDetails packageObj={selectedPackage} />
      </Modal>
    </div>
  );
};
export default ClientPackages;
