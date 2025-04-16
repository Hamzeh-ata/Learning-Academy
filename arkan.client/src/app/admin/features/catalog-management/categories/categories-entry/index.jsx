import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { createCategory, updateCategory } from '@/services/admin-services/catalog-management-services/category.service';
import { TextInput, SwitchButtonField, UploadImageField } from '@shared/components/form-elements';

export const CategoryEntry = ({ category, onSubmitted }) => {
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
      name: category?.name || '',
      status: category?.status === undefined ? true : Boolean(category?.status),
      description: category?.description || '',
      image: category?.image || null
    });
  }, [category, reset]);

  const onSubmit = (data) => {
    if (category) {
      dispatch(updateCategory({ ...data, id: category.id }));
    } else {
      dispatch(createCategory(data));
    }
    onSubmitted();
    reset();
  };

  return (
    <div className="bg-gray-800">
      <h3 className="text-gray-300 text-lg mt-2"> {category ? 'Update' : 'Add'} Category</h3>
      <form
        className="text-gray-400 px-5 pb-5 overflow-y-auto max-h-[calc(100vh-250px)]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextInput label="Name" error={errors.name} register={register('name', { required: 'Name is required' })} />

        <SwitchButtonField
          name="status"
          rules={{
            validate: (value) => value === true || value === false || 'Status is required.'
          }}
          label="Status"
          error={errors.status}
          control={control}
        />

        <TextInput
          label="Description"
          error={errors.description}
          register={register('description', { required: 'Description is required' })}
          isTextArea
        />
        <UploadImageField
          name="image"
          label="Photo"
          error={errors.image}
          rules={{ required: 'image is required' }}
          control={control}
        />

        <button className="btn" type="submit">
          {category ? 'Update Category' : 'Add Category'}
        </button>
      </form>
    </div>
  );
};
