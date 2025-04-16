import { useDispatch, useSelector } from 'react-redux';
import {
  packagesThunks,
  selectAllPackages,
  selectLoading,
  selectPagination
} from '@/slices/admin-slices/catalog-management-slices/package.slice';
import alertService from '@services/alert/alert.service';
import { Loader } from '@shared/components';
import { Tooltip } from 'primereact/tooltip';
import { getImageFullPath } from '@utils/image-path';
import { PackageActions } from '../package-actions';

export const PackagesList = ({ setSelectedPackage }) => {
  const dispatch = useDispatch();
  const pagination = useSelector(selectPagination);
  const isLoading = useSelector(selectLoading);
  const packages = useSelector(selectAllPackages);

  const handlePageChange = (newPage) => {
    dispatch(packagesThunks.fetchPaginated({ currentPage: newPage, pageSize: 10 }));
  };

  const handleDelete = (packageId) => {
    alertService.showConfirmation({
      title: 'Confirm Delete',
      body: 'Are you sure you want to delete this Package',
      callback: () => dispatch(packagesThunks.delete(packageId))
    });
  };

  return (
    <div>
      <div>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Discounted Price</th>
              <th>Courses Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan="6" className="text-center p-10 h-28">
                  <Loader />
                </td>
              </tr>
            )}
            {packages?.map((packageItem) => (
              <tr key={packageItem.id}>
                <td>
                  <div className="flex items-center gap-4 max-w-[30rem]">
                    <img
                      className="rounded-full shadow-xl w-12 h-12 object-fill"
                      src={getImageFullPath(packageItem.image)}
                      alt={'package'}
                    />
                    <Tooltip target={`.package-title-${packageItem.id}`}>
                      <p className="flex text-left text-md max-w-56 w-fit">{packageItem.name}</p>
                    </Tooltip>
                    <p className={`line-clamp-2 break-all package-title-${packageItem.id}`}>{packageItem.name}</p>
                  </div>
                </td>
                <td>
                  <Tooltip target={`.package-desc-${packageItem.id}`}>
                    <p className="flex text-left max-w-48 text-md">{packageItem.description}</p>
                  </Tooltip>
                  <p className={`line-clamp-2 max-w-56 w-fit break-all package-desc-${packageItem.id}`}>
                    {packageItem.description}
                  </p>
                </td>
                <td>{packageItem.price}</td>
                <td>{packageItem.discountPrice}</td>
                <td>{packageItem.coursesCount}</td>
                <td>
                  <PackageActions
                    onEdit={() => setSelectedPackage(packageItem)}
                    onDelete={() => handleDelete(packageItem.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <button
          className={`px-4 py-2 ${pagination.currentPage === 1 ? 'text-gray-500 cursor-no-drop' : 'text-gray-200'}`}
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
        >
          Previous
        </button>

        <button
          className={`px-4 py-2 ${!pagination.hasNextPage ? 'text-gray-500 cursor-no-drop' : 'text-gray-200'}`}
          onClick={() => handlePageChange(pagination?.currentPage + 1)}
          disabled={!pagination.hasNextPage}
        >
          Next
        </button>
        <span>
          Page : {pagination.currentPage} / {pagination.totalPages}
        </span>
        <span className="ms-4">
          Shown Packages : {packages.length} / {pagination.totalCount}
        </span>
      </div>
    </div>
  );
};
