import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

import { addQuestion, updateQuestion } from '@/services/admin-services/frequently-questions.service';

import { TextInput } from '@shared/components/form-elements';

export const FrequentlyQuestionsEntry = ({ question, onSubmitted }) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    reset({
      title: question?.title || '',
      answer: question?.answer || ''
    });
  }, [question, reset]);

  const onSubmit = (data) => {
    if (question) {
      data.id = question.id;
      dispatch(updateQuestion({ data }));
    } else {
      dispatch(addQuestion({ data }));
    }
    onSubmitted();
    reset();
  };

  return (
    <div className="bg-gray-800">
      <h3 className="text-gray-300 text-lg mt-2"> {question ? 'Update' : 'Add'} Question</h3>
      <form
        className="text-gray-400 px-5 pb-5 overflow-y-auto max-h-[calc(100vh-250px)]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextInput
          label="Title"
          error={errors.tittle}
          register={register('title', { required: 'Title is required' })}
        />

        <TextInput
          label="Answer"
          error={errors.answer}
          register={register('answer', { required: 'Answer is required' })}
        />

        <button className="btn" type="submit">
          {question ? 'Update Question' : 'Add Question'}
        </button>
      </form>
    </div>
  );
};
