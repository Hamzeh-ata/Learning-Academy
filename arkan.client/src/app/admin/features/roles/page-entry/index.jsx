import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { TextInput } from '@shared/components/form-elements';
import { addPage } from '@services/permission-services/pages.service';

export const PageEntry = ({ onSubmitted }) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const initializeForm = () => {
    reset();
  };

  useEffect(initializeForm, [reset]);

  const onSubmit = (data) => {
    dispatch(addPage(data));

    onSubmitted();
    reset();
  };

  return (
    <div className="bg-gray-800">
      <h3 className="text-gray-300 text-lg mt-2"> Add New Page</h3>

      <form className="text-gray-400 px-2" onSubmit={handleSubmit(onSubmit)}>
        <TextInput label="Name" error={errors.name} register={register('name', { required: 'Name is required' })} />
        <TextInput
          label="Component Name"
          error={errors.componentName}
          register={register('componentName', { required: 'Component Name is required' })}
        />
        <button className="btn" type="submit">
          Add Page
        </button>
      </form>
    </div>
  );
};
