import { useDispatch, useSelector } from 'react-redux';
import { selectPaginationData, selectLoading } from '@/slices/admin-slices/course-management-slices/chapters.slice';
import { deleteChapter, fetchChapters } from '@/services/admin-services/course-management-services/chapters.service';
import alertService from '@services/alert/alert.service';
import { Loader, TrashIcon, EditIcon } from '@shared/components';
import { Button } from 'primereact/button';
import { usePermissionCheck } from '@hooks';

export const ChaptersList = ({ chapters, setSelectedChapter, courseId }) => {
  const dispatch = useDispatch();
  const pagination = useSelector(selectPaginationData);
  const isLoading = useSelector(selectLoading);

  const { edit, delete: canDelete } = usePermissionCheck();

  const handlePageChange = (newPage) => {
    dispatch(fetchChapters({ currentPage: newPage, pageSize: 10, courseId }));
  };

  const handleDelete = (chapter) => {
    alertService.showConfirmation({
      title: 'Confirm Delete',
      body: 'Are you sure you want to delete this chapter',
      callback: () => dispatch(deleteChapter(chapter))
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
              <th>Cost</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan="4" className="text-center p-10 h-28">
                  <Loader />
                </td>
              </tr>
            )}
            {chapters?.map((chapter) => (
              <tr key={chapter.id}>
                <td className="break-all truncate max-w-[250px]">{chapter.name}</td>
                <td className="break-all truncate max-w-[250px]">{chapter.description}</td>
                <td>{chapter.isFree ? 'Free' : 'paid'}</td>
                <td>
                  <div className="flex gap-4">
                    {edit && (
                      <Button tooltip="Edit" onClick={() => setSelectedChapter(chapter)}>
                        <EditIcon />
                      </Button>
                    )}

                    {canDelete && (
                      <Button tooltip="Delete" onClick={() => handleDelete(chapter)}>
                        <TrashIcon />
                      </Button>
                    )}
                  </div>
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
          Shown Chapters : {chapters.length} / {pagination.totalCount}
        </span>
      </div>
    </div>
  );
};
