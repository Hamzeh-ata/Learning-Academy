import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { updateChapter, createChapter } from '@/services/admin-services/course-management-services/chapters.service';
import { TextInput, SwitchButtonField } from '@shared/components/form-elements';

export const ChapterEntry = ({ chapter, onSubmitted, courseId }) => {
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

  useEffect(initializeForm, [chapter, reset]);

  const onSubmit = (data) => {
    data.courseId = courseId;
    if (chapter) {
      data.id = chapter.id;
      dispatch(updateChapter(data));
    } else {
      dispatch(createChapter(data));
    }
    onSubmitted();
    reset();
  };

  return (
    <div className="bg-gray-800">
      <form className="text-gray-400 px-2" onSubmit={handleSubmit(onSubmit)}>
        <TextInput label="Name" error={errors.name} register={register('name', { required: 'Name is required' })} />
        <TextInput
          label="Description"
          error={errors.description}
          register={register('description', { required: 'Description is required' })}
          isTextArea
        />
        <SwitchButtonField name="isFree" label="Free" control={control} />
        <button className="btn" type="submit">
          {chapter ? 'Update Chapter' : 'Add Chapter'}
        </button>
      </form>
    </div>
  );
};
