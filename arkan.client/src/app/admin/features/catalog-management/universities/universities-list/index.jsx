import { useDispatch, useSelector } from 'react-redux';
import { selectLoading, selectPaginationData } from '@/slices/admin-slices/catalog-management-slices/university.slice';
import {
  fetchUniversities,
  deleteUniversity
} from '@/services/admin-services/catalog-management-services/universities.service';
import { Loader } from '@shared/components';
import alertService from '@services/alert/alert.service';
import { UniversityTitle } from '../components/university-title';
import { UniversityActions } from '../components/university-actions';

export const UniversitiesList = ({ setSelectedUniversity, universities }) => {
  const pagination = useSelector(selectPaginationData);
  const isLoading = useSelector(selectLoading);
  const dispatch = useDispatch();

  const handleDelete = (university) => {
    alertService.showConfirmation({
      title: 'Confirm Delete',
      body: 'Are you sure you want delete this university',
      callback: () => dispatch(deleteUniversity(university))
    });
  };

  const handlePageChange = (newPage) => {
    dispatch(fetchUniversities({ currentPage: newPage, pageSize: 10 }));
  };

  return (
    <div>
      <div>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Short name</th>
              <th>Courses Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && universities.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-10 h-28">
                  <Loader />
                </td>
              </tr>
            )}
            {!isLoading &&
              universities.length !== 0 &&
              universities?.map((university) => (
                <tr key={university.id}>
                  <td>
                    <UniversityTitle title={university.name} image={university.image} id={university.id} />
                  </td>
                  <td>{university.shortName}</td>
                  <td>{university.coursesCount || 0}</td>
                  <td>
                    <UniversityActions
                      setSelectedUniversity={setSelectedUniversity}
                      university={university}
                      handleDelete={handleDelete}
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
          Shown Universities : {universities.length} / {pagination.totalCount}
        </span>
      </div>
    </div>
  );
};
