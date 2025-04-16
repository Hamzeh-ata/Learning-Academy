import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { TextInput, SwitchButtonField } from '@shared/components/form-elements';
import { chaptersThunks } from '@services/client-services/instructor-course-profile.service';

export const InstructorChapterEntry = ({ chapter, onSubmitted, courseId }) => {
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
      ...chapter
    });
  };

  const onSubmit = (data) => {
    const processedData = {
      ...data,
      id: chapter?.id,
      courseId,
      isFree: Boolean(data.isFree)
    };

    if (chapter) {
      dispatch(chaptersThunks.update(processedData));
    } else {
      dispatch(chaptersThunks.create(processedData));
    }

    onSubmitted();
    reset();
  };

  useEffect(initializeForm, [chapter, reset]);

  return (
    <div className="overflow-y-auto max-h-screen">
      <h3 className="text-lg mt-2 font-semibold">{chapter ? 'Update' : 'Add'} Chapter</h3>
      <form className="text-gray-400 p-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6 pb-5">
          <TextInput
            label="Name"
            error={errors.name}
            register={register('name', { required: 'Chapter Name is required' })}
          />

          <TextInput
            label="Description"
            isTextArea
            error={errors.description}
            register={register('description', { required: 'Description is required' })}
          />

          <SwitchButtonField name="isFree" label="Free Chapter?" control={control} />
        </div>
        <button className="btn text-end mt-2 md:mt-0" type="submit">
          {chapter ? 'Update Chapter' : 'Add Chapter'}
        </button>
      </form>
    </div>
  );
};
