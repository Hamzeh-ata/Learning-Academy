import { addAdmin, updateAdminInfo } from '@/services/admin-services/user-services';
import { selectAllRoles } from '@/slices/admin-slices/roles.slice';
import { MultiSelectField, TextInput, UploadImageField } from '@shared/components/form-elements';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

export const AdminEntry = ({ admin, onSubmitted }) => {
  const allRoles = useSelector(selectAllRoles);

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
      ...admin,
      roles: admin?.roles?.map((roleId) => allRoles.find((role) => role.id === roleId.id)?.id) ?? []
    });
  }, [admin, reset, allRoles]);

  const onSubmit = (data) => {
    const action = admin ? updateAdminInfo : addAdmin;
    dispatch(action({ ...data, id: admin?.id }));
    onSubmitted();
    reset();
  };

  return (
    <div className="bg-gray-800">
      <h3 className="text-gray-300 text-lg mt-2"> {admin ? 'Update' : 'Add'} Admin</h3>
      <form
        className="text-gray-400 px-5 py-5 overflow-y-auto max-h-[calc(100vh-250px)]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextInput
          label="First Name"
          error={errors.firstName}
          register={register('firstName', { required: 'First Name is required' })}
        />

        <TextInput
          label="Last Name"
          error={errors.lastName}
          register={register('lastName', { required: 'Last Name is required' })}
        />

        <TextInput
          label="Email"
          error={errors.email}
          type="email"
          register={register('email', { required: 'Email is required' })}
        />

        {!admin && (
          <TextInput
            label="Password"
            error={errors.password}
            type="password"
            register={register('password', {
              required: 'Password is required',
              validate: {
                nonAlphanumeric: (value) =>
                  /[\W_]+/.test(value) || 'Password requires at least one non-alphanumeric character',
                lowerCase: (value) => /[a-z]+/.test(value) || 'Password requires at least one lowercase letter',
                upperCase: (value) => /[A-Z]+/.test(value) || 'Password requires at least one uppercase letter'
              }
            })}
          />
        )}

        <TextInput
          label="Phone NO."
          error={errors.phoneNumber}
          type="phoneNumber"
          register={register('phoneNumber', { required: 'Phone NO. is required' })}
        />

        {!!allRoles.length && (
          <MultiSelectField
            name="roles"
            label="Roles"
            error={errors.roles}
            placeholder="Select Roles"
            maxSelectedLabels={3}
            filter
            control={control}
            options={allRoles}
          />
        )}

        <UploadImageField name="image" label="Photo" error={errors.image} control={control} />

        <button className="btn" type="submit">
          {admin ? 'Update Admin' : 'Add Admin'}
        </button>
      </form>
    </div>
  );
};
