import { useDispatch, useSelector } from 'react-redux';
import { selectLoading } from '@/slices/admin-slices/course-management-slices/lessons.slice';
import AlertService from '@services/alert/alert.service';
import { Loader, TrashIcon, EditIcon, FeatherIcon } from '@shared/components';
import { Button } from 'primereact/button';
import { deleteLesson } from '@/services/admin-services/course-management-services/lessons.service';
import { usePermissionCheck } from '@hooks';
import { getImageFullPath } from '@utils/image-path';

export const LessonsList = ({ lessons, setSelectedLessons, setSelectedLessonVideo }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectLoading);

  const { edit, delete: canDelete } = usePermissionCheck();

  const handleDelete = (lesson) => {
    AlertService.showConfirmation({
      title: 'Confirm Delete',
      body: 'Are you sure you want to delete this lesson',
      callback: () => dispatch(deleteLesson(lesson))
    });
  };

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Cost</th>
            <th>Video URL</th>
            <th>Material</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan="5" className="text-center p-10 h-28">
                <Loader />
              </td>
            </tr>
          )}
          {lessons?.map((lesson) => (
            <tr key={lesson.id}>
              <td className="break-all truncate max-w-[250px]">{lesson.name}</td>
              <td>{lesson.isFree ? 'Free' : 'paid'}</td>
              <td>
                <a
                  className="text-blue-400 hover:underline cursor-pointer"
                  onClick={() => setSelectedLessonVideo(lesson)}
                >
                  {lesson.videoUrl}
                </a>
              </td>
              <td>
                {lesson.material && (
                  <a href={getImageFullPath(lesson.material, null)} target="_blank">
                    <FeatherIcon name="File" className="text-red-300" />
                  </a>
                )}
              </td>
              <td>
                <div className="flex gap-4">
                  {edit && (
                    <Button tooltip="Edit" onClick={() => setSelectedLessons(lesson)}>
                      <EditIcon />
                    </Button>
                  )}

                  {canDelete && (
                    <Button tooltip="Delete" onClick={() => handleDelete(lesson)}>
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
  );
};
