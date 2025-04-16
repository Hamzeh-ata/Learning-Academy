import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import {
  updateUniversity,
  createUniversity
} from '@/services/admin-services/catalog-management-services/universities.service';
import { TextInput, UploadImageField } from '@shared/components/form-elements';

export const UniversityEntry = ({ university, onSubmitted }) => {
  const dispatch = useDispatch();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    reset({
      name: university?.name || '',
      shortName: university?.shortName || '',
      image: university?.image || null
    });
  }, [university, reset]);

  const onSubmit = (data) => {
    if (university) {
      dispatch(updateUniversity({ ...data, id: university.id }));
    } else {
      dispatch(createUniversity(data));
    }
    onSubmitted();
    reset();
  };

  return (
    <div className="bg-gray-800">
      <h3 className="text-gray-300 text-lg mt-2"> {university ? 'Update' : 'Add'} University</h3>
      <form
        className="text-gray-400 px-5 pb-5 overflow-y-auto max-h-[calc(100vh-250px)]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextInput label="Name" error={errors.name} register={register('name', { required: 'Name is required' })} />

        <TextInput
          label="Short Name"
          error={errors.shortName}
          register={register('shortName', { required: 'Short name is required' })}
        />

        <UploadImageField
          name="image"
          label="Photo"
          error={errors.image}
          rules={{ required: 'image is required' }}
          control={control}
        />

        <button className="btn" type="submit">
          {university ? 'Update University' : 'Add University'}
        </button>
      </form>
    </div>
  );
};
