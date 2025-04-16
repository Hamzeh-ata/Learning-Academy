import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { updateAnswer, createAnswer } from '@/services/admin-services/course-management-services/answers.service';
import { UploadImageField, SwitchButtonField, NumberInput, TextInput } from '@shared/components/form-elements';

export const AnswerEntry = ({ answer, onSubmitted, questionId }) => {
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
      ...answer,
      order: answer?.order || 0,
      isCorrect: Boolean(answer?.isCorrect)
    });
  };

  useEffect(initializeForm, [answer, reset]);

  const onSubmit = (data) => {
    const processedData = {
      ...data
    };
    if (answer) {
      processedData.id = answer.id;
      dispatch(updateAnswer({ answer: processedData, questionId }));
    } else {
      dispatch(createAnswer({ answer: processedData, questionId }));
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

        <SwitchButtonField name="isCorrect" label="Correct answer" control={control} />

        <UploadImageField name="image" label="Photo" control={control} />

        <button className="btn" type="submit">
          {answer ? 'Update Answer' : 'Add Answer'}
        </button>
      </form>
    </div>
  );
};
