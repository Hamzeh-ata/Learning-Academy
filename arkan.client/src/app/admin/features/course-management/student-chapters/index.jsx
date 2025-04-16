import {
  getChapterStudents,
  getChapterHiddenStudents,
  hideChapterStudents,
  unHideChapterStudents
} from '@services/admin-services/students-chapters.service';
import { selectLoading, selectStudentsChapters, selectPagination } from '@slices/admin-slices/students-chapters.slice';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Paginator } from 'primereact/paginator';

export const ChapterStudentsList = ({
  chapterId,
  courseId,
  setSelectedStudents,
  selectedStudents,
  filters,
  setFilters,
  studentsType
}) => {
  const dispatch = useDispatch();
  const pagination = useSelector(selectPagination);
  const isLoading = useSelector(selectLoading);
  const chapterStudents = useSelector(selectStudentsChapters);

  useEffect(() => {
    if (studentsType === 'chapter') {
      dispatch(
        getChapterStudents({
          chapterId: chapterId,
          courseId: courseId,
          pageNumber: filters.pageNumber || 1,
          pageSize: filters.pageSize || 10
        })
      );
    } else if (studentsType === 'none') {
      dispatch(
        getChapterHiddenStudents({
          chapterId: chapterId,
          courseId: courseId,
          pageNumber: filters.pageNumber || 1,
          pageSize: filters.pageSize || 10
        })
      );
    }
  }, [dispatch, chapterId, courseId, filters.pageNumber, filters.pageSize, studentsType]);

  const onPageChange = useCallback(
    (event) => {
      setFilters((f) => ({
        ...f,
        first: event.first,
        pageNumber: event.page + 1,
        pageSize: event.rows
      }));
    },
    [setFilters]
  );

  const handleSelectStudent = (studentId, checked) => {
    setSelectedStudents((prev) => (checked ? [...prev, studentId] : prev.filter((id) => id !== studentId)));
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const newSelectedStudents = new Set(selectedStudents);
      chapterStudents.forEach((student) => {
        newSelectedStudents.add(student.userId);
      });
      setSelectedStudents(Array.from(newSelectedStudents));
    } else {
      setSelectedStudents((prev) => prev.filter((id) => !chapterStudents.some((student) => student.userId === id)));
    }
  };

  const isStudentSelected = (studentId) => selectedStudents.includes(studentId);
  const areAllStudentsSelected = chapterStudents.every((student) => isStudentSelected(student.userId));
  const handleHideStudents = () => {
    dispatch(
      hideChapterStudents({
        chapterId,
        courseId,
        userIds: selectedStudents
      })
    ).then(() => {
      setSelectedStudents([]);
    });
  };

  const handleUnHideStudents = () => {
    dispatch(
      unHideChapterStudents({
        chapterId,
        courseId,
        userIds: selectedStudents
      })
    ).then(() => {
      setSelectedStudents([]);
    });
  };

  return (
    <div>
      <div className="flex items-center mb-4 mt-2"></div>
      {chapterStudents?.length === 0 && studentsType != null && (
        <div>
          <p>No students found</p>
        </div>
      )}
      {!isLoading && chapterStudents?.length !== 0 && (
        <div>
          <div>
            <table className="table">
              <thead>
                <tr>
                  <th>
                    <Checkbox
                      onChange={(e) => handleSelectAll(e.checked)}
                      checked={areAllStudentsSelected && chapterStudents.length > 0}
                    />
                  </th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Enroll Date</th>
                </tr>
              </thead>
              <tbody>
                {chapterStudents.map((student) => (
                  <tr key={student.userId}>
                    <td>
                      <Checkbox
                        onChange={(e) => handleSelectStudent(student.userId, e.checked)}
                        checked={isStudentSelected(student.userId)}
                      />
                    </td>
                    <td>{student.userName}</td>
                    <td>{student.phoneNumber}</td>
                    <td>{student.enrollDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selectedStudents.length > 0 && studentsType === 'chapter' && (
            <div className="mb-4 mt-4">
              <button onClick={handleHideStudents} className="btn btn-danger">
                Hide
              </button>
            </div>
          )}
          {selectedStudents.length > 0 && studentsType === 'none' && (
            <div className="mb-4 mt-4">
              <button onClick={handleUnHideStudents} className="btn btn-danger">
                Un hide
              </button>
            </div>
          )}
          <div className="py-2 flex justify-center w-full">
            <Paginator
              first={filters?.first}
              rows={filters?.pageSize}
              totalRecords={pagination?.totalCount}
              rowsPerPageOptions={[10, 20, 30]}
              onPageChange={onPageChange}
              className="flex w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};
