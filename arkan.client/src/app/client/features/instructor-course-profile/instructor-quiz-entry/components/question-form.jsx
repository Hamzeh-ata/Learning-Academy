import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { UploadImageField, NumberInput, TextInput } from '@shared/components/form-elements';
import { questionsThunks } from '@services/client-services/instructor-course-profile.service';

export const QuestionForm = ({ question, onSubmitted, quizId, onCancel }) => {
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
      points: question?.points || 0
    });
  };

  useEffect(initializeForm, [question, reset]);

  const onSubmit = async (data) => {
    const processedData = {
      ...data,
      quizId
    };
    if (question) {
      processedData.id = question?.id;
      dispatch(questionsThunks.update(processedData));
    } else {
      dispatch(questionsThunks.create(processedData));
    }

    onSubmitted();
  };

  return (
    <div>
      <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
        <h3 className="form-title">{question?.id ? 'Update' : 'Add'} Question Form</h3>
        <div className="form-grid-question">
          <TextInput
            label="Title"
            error={errors.title}
            register={register('title', { required: 'Title is required' })}
          />

          <TextInput label="Description" error={errors.description} register={register('description')} isTextArea />

          <NumberInput
            name="points"
            label="Points"
            control={control}
            error={errors.points}
            rules={{ required: 'points is required' }}
          />

          <UploadImageField name="image" label="Image" control={control} />
        </div>

        <div className="flex justify-end flex-wrap gap-4">
          <button
            onClick={(e) => {
              e.preventDefault();
              onCancel();
            }}
          >
            Cancel
          </button>
          <button className="btn submit-button" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};
