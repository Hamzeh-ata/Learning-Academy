import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { UploadImageField, TextInput, SwitchButtonField } from '@shared/components/form-elements';
import { useEffect } from 'react';
import { answersThunks } from '@services/client-services/instructor-course-profile.service';

export const AnswerForm = ({ questionId, answer, onSubmitted, onCancel }) => {
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
      isCorrect: Boolean(answer?.isCorrect)
    });
  };

  useEffect(initializeForm, [answer, reset]);

  const onSubmit = (data) => {
    const processedData = {
      ...data,
      questionId
    };
    if (answer) {
      processedData.id = answer.id;
      dispatch(answersThunks.update(processedData));
    } else {
      dispatch(answersThunks.create(processedData));
    }

    onSubmitted();
  };

  return (
    <div>
      <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
        <h3 className="form-title">{answer?.id ? 'Update' : 'Add'} Answer Form</h3>
        <div className="form-grid-question">
          <TextInput
            label="Title"
            error={errors.title}
            register={register('title', { required: 'Title is required' })}
          />

          <TextInput label="Description" error={errors.description} register={register('description')} isTextArea />

          <SwitchButtonField name="isCorrect" label="Correct answer" control={control} />

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
