import { Modal, PlusIcon } from '@shared/components';
import { useState } from 'react';
import { usePermissionCheck } from '@hooks';
import { FrequentlyQuestionsList, FrequentlyQuestionsEntry } from '@/app/admin/features/frequently-questions';
import { useFetchFrequentlyQuestions } from '@/app/admin/hooks';

const FrequentlyAskedQuestions = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { create } = usePermissionCheck('frequently-questions');
  const questions = useFetchFrequentlyQuestions();
  const resetForm = () => {
    setSelectedQuestion(null);
    setIsModalOpen(false);
  };

  const handleSelectedQuestion = (question) => {
    setSelectedQuestion(question);
    setIsModalOpen(true);
  };
  const Header = () => (
    <div className="flex justify-between mb-6 text-lg font-semibold text-gray-200">
      <div>Frequently Asked Questions</div>
      {create && (
        <button
          onClick={() => {
            setIsModalOpen(true);
          }}
          className="text-orange-500"
        >
          <PlusIcon />
        </button>
      )}
    </div>
  );

  return (
    <>
      <Header />
      {!questions.length && <p>You don`t have any frequently asked questions, click on the plus to add.</p>}
      {questions.length > 0 && (
        <FrequentlyQuestionsList frequentlyQuestions={questions} setSelectedQuestion={handleSelectedQuestion} />
      )}

      <Modal isOpen={isModalOpen} onClose={resetForm}>
        <FrequentlyQuestionsEntry question={selectedQuestion} onSubmitted={resetForm} />
      </Modal>
    </>
  );
};

export default FrequentlyAskedQuestions;
