import { getQuizStudentsAttempts } from '@services/admin-services/quiz-attempts.service';
import { selectLoading, selectPagination, selectQuizAttempts } from '@slices/admin-slices/quiz-attempts.slice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import { formatDate } from '@utils/date-format';

export const QuizAttemptsList = ({ quizId }) => {
  const dispatch = useDispatch();
  const pagination = useSelector(selectPagination);
  const isLoading = useSelector(selectLoading);
  const quizAttempts = useSelector(selectQuizAttempts);
  const [studentName, setStudentName] = useState('');
  const debouncedSearchTerm = useDebounce(studentName, 500);

  const handlePageChange = (newPage) => {
    dispatch(
      getQuizStudentsAttempts({
        quizId: quizId,
        pageNumber: newPage,
        pageSize: pagination.pageSize,
        studentName: debouncedSearchTerm
      })
    );
  };

  const handleInputChange = (e) => {
    setStudentName(e.target.value);
  };

  const handleSubmit = () => {
    handlePageChange(pagination.currentPage);
  };

  useEffect(() => {
    handleSubmit();
  }, [debouncedSearchTerm, quizId]);

  return (
    <div>
      <div className="flex items-center mb-4 mt-2">
        <input
          type="text"
          value={studentName}
          onChange={handleInputChange}
          placeholder="Search By Student Name..."
          className="placeholder:text-gray-400 placeholder:text-md px-3 py-2 border focus:border-gray-400 bg-gray-800 border-gray-500 w-full rounded-md focus:outline-none"
        />
      </div>
      {quizAttempts?.length === 0 && (
        <div>
          <p>No Attempts found.</p>
        </div>
      )}
      {!isLoading && quizAttempts?.length !== 0 && (
        <div>
          <div>
            <table className="table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Attempt Date</th>
                  <th>Student Mark</th>
                  <th>Time Taken</th>
                </tr>
              </thead>
              <tbody>
                {quizAttempts.map((attempt) => (
                  <tr key={attempt.id}>
                    <td>{attempt.studentName}</td>
                    <td>{formatDate(attempt.attemptDate)}</td>
                    <td>{attempt.studentMark}</td>
                    <td>{attempt.timeTaken}</td>
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
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
            >
              Next
            </button>
            <span>
              Page : {pagination.currentPage} / {pagination.totalPages}
            </span>
            <span className="ms-4">
              Shown attempts : {quizAttempts?.length} / {pagination.totalCount}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
