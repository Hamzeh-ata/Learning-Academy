import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { updateQuestion, createQuestion } from '@/services/admin-services/course-management-services/questions.service';
import { UploadImageField, NumberInput, TextInput } from '@shared/components/form-elements';

export const QuestionEntry = ({ question, onSubmitted, quizId }) => {
  const dispatch = useDispatch();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const initializeForm = () => {
    reset({
      ...question,
      order: question?.order || 0,
      points: question?.points || 0
    });
  };
  useEffect(initializeForm, [question, reset]);

  const onSubmit = (data) => {
    const processedData = {
      ...data
    };

    if (question) {
      processedData.id = question.id;
      dispatch(updateQuestion(processedData));
    } else {
      dispatch(createQuestion({ question: processedData, quizId }));
    }

    onSubmitted();
    reset();
  };

  return (
    <div className="bg-gray-800">
      <form className="text-gray-400 px-2" onSubmit={handleSubmit(onSubmit)}>
        <TextInput label="Title" error={errors.title} register={register('title', { required: 'Title is required' })} />

        <TextInput label="Description" error={errors.description} register={register('description')} isTextArea />

        <NumberInput
          name="order"
          label="Order"
          control={control}
          error={errors.order}
          rules={{ required: 'Order is required' }}
        />
        <NumberInput
          name="points"
          label="Points"
          control={control}
          error={errors.points}
          rules={{ required: 'points is required' }}
        />

        <UploadImageField name="image" label="Photo" control={control} />

        <button className="btn" type="submit">
          {question ? 'Update Question' : 'Add Question'}
        </button>
      </form>
    </div>
  );
};
