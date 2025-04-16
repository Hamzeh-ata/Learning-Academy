import { useDispatch, useSelector } from 'react-redux';
import { selectLoading, selectPaginationData } from '@/slices/admin-slices/activity-log.slice';
import { fetchActivitesLog } from '@/services/admin-services/activity-log.service';
import { Loader } from '@shared/components';

export const ActivityLogList = ({ activites }) => {
  const pagination = useSelector(selectPaginationData);
  const isLoading = useSelector(selectLoading);
  const dispatch = useDispatch();

  const handlePageChange = (newPage) => {
    dispatch(fetchActivitesLog({ currentPage: newPage, pageSize: 10 }));
  };
  return (
    <div>
      <div>
        <table className="table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Action</th>
              <th>Type</th>
              <th>Item Name</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && activites.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-10 h-28">
                  <Loader />
                </td>
              </tr>
            )}
            {!isLoading &&
              activites.length !== 0 &&
              activites?.map((activity) => (
                <tr key={activity.id}>
                  <td>{activity.userName}</td>
                  <td>{activity.action}</td>
                  <td>{activity.type}</td>
                  <td className="break-all truncate max-w-[200px]">{activity.itemName}</td>
                  <td>{activity.dateTime}</td>
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
          Shown Activites : {activites.length} / {pagination.totalCount}
        </span>
      </div>
    </div>
  );
};
