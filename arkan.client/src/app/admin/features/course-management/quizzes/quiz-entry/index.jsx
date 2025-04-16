import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { updateQuiz, createQuiz } from '@/services/admin-services/course-management-services/quizzes.service';
import { NumberInput, TextInput, SwitchButtonField } from '@shared/components/form-elements';

export const QuizEntry = ({ quiz, onSubmitted, lessonId }) => {
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
      ...quiz,
      timeLimit: quiz?.timeLimit || 0,
      totalMarks: quiz?.totalMarks || 0,
      isRequired: Boolean(quiz?.isRequired),
      isRandomized: Boolean(quiz?.isRandomized)
    });
  };

  useEffect(initializeForm, [quiz, reset]);

  const onSubmit = (data) => {
    const processedData = {
      ...data,
      lessonId
    };

    if (quiz) {
      processedData.id = quiz.id;
      processedData.quizId = quiz.id;
      dispatch(updateQuiz(processedData));
    } else {
      dispatch(createQuiz(processedData));
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
          name="timeLimit"
          label="Time Limit (Minutes)"
          control={control}
          error={errors.timeLimit}
          rules={{ required: 'Time Limit is required' }}
        />

        <NumberInput
          name="totalMarks"
          label="Total Marks"
          control={control}
          error={errors.totalMarks}
          rules={{ required: 'Total Marks is required' }}
        />

        <div className="flex">
          <SwitchButtonField name="isRequired" label="Required Quiz" control={control} />
          <SwitchButtonField name="isRandomized" label="Randomly Ordered" control={control} />
        </div>

        <button className="btn" type="submit">
          {quiz ? 'Update Quiz' : 'Add Quiz'}
        </button>
      </form>
    </div>
  );
};
