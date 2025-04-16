import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { updateRole, addRole } from '@services/admin-services/roles.service';
import { TextInput } from '@shared/components/form-elements';

export const RoleEntry = ({ role, onSubmitted }) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const initializeForm = () => {
    reset({
      ...role
    });
  };

  useEffect(initializeForm, [reset, role]);

  const onSubmit = (data) => {
    if (role) {
      data.id = role.id;
      dispatch(updateRole(data));
    } else {
      dispatch(addRole(data));
    }

    onSubmitted();
    reset();
  };
  return (
    <div className="bg-gray-800">
      <h3 className="text-gray-300 text-lg mt-2"> {role ? 'Update' : 'Add'} Role</h3>

      <form className="text-gray-400 px-2" onSubmit={handleSubmit(onSubmit)}>
        <TextInput label="Name" error={errors.name} register={register('name', { required: 'Name is required' })} />

        <TextInput
          label="Description"
          error={errors.description}
          register={register('description', { required: 'Description is required' })}
          isTextArea
        />
        <button className="btn" type="submit">
          {role ? 'Update Role' : 'Add Role'}
        </button>
      </form>
    </div>
  );
};
