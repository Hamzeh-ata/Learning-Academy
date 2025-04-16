import { useDispatch, useSelector } from 'react-redux';
import { selectLoading } from '@/slices/admin-slices/frequently-questions.slice';
import { deleteQuestion } from '@/services/admin-services/frequently-questions.service';
import { Loader } from '@shared/components';
import alertService from '@services/alert/alert.service';
import { FrequentlyQuestionsActions } from '../components/frequently-questions-actions';

export const FrequentlyQuestionsList = ({ setSelectedQuestion, frequentlyQuestions }) => {
  const isLoading = useSelector(selectLoading);
  const dispatch = useDispatch();

  const handleDelete = (question) => {
    alertService.showConfirmation({
      title: 'Confirm Delete',
      body: 'Are you sure you want delete this question',
      callback: () => dispatch(deleteQuestion(question))
    });
  };

  return (
    <div>
      <div>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Answers</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && frequentlyQuestions.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-10 h-28">
                  <Loader />
                </td>
              </tr>
            )}
            {!isLoading &&
              frequentlyQuestions.length !== 0 &&
              frequentlyQuestions?.map((question) => (
                <tr key={question.id}>
                  <td>{question.title}</td>
                  <td>{question.answer}</td>
                  <td>
                    {question && (
                      <FrequentlyQuestionsActions
                        setSelectedQuestion={setSelectedQuestion}
                        question={question}
                        handleDelete={handleDelete}
                      />
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
