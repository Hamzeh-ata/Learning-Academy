import { adminChangePassword as changePassword } from '@/services/admin-services/user-services';
import alertService from '@services/alert/alert.service';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

export const AdminChangePassword = ({ userId, onSubmitted }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm({ defaultValues: { value: '' } });

  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    const request = { userId, newPassword: data.value };
    try {
      await dispatch(changePassword(request));
      alertService.showToast({ type: 'success', title: 'Password Updated Successfully!' });
      onSubmitted();
    } catch (e) {
      console.error(e);
    }
    reset();
  };

  return (
    <div className="bg-gray-800">
      <h3 className="text-gray-300 text-lg mt-2"> Change Password</h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="text-gray-400 px-5 py-5 overflow-y-auto max-h-[calc(100vh-250px)]"
        autoComplete="off"
      >
        <Controller
          name="value"
          control={control}
          rules={{
            required: 'Password is required.',
            validate: {
              nonAlphanumeric: (value) =>
                /[\W_]+/.test(value) || 'Password requires at least one non-alphanumeric character',
              lowerCase: (value) => /[a-z]+/.test(value) || 'Password requires at least one lowercase letter',
              upperCase: (value) => /[A-Z]+/.test(value) || 'Password requires at least one uppercase letter'
            }
          }}
          render={({ field, fieldState }) => (
            <>
              <div className="field">
                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>
                  Password
                </label>

                <Password
                  {...field}
                  feedback
                  pt={{
                    input: {
                      autoComplete: 'new-password'
                    }
                  }}
                  autoComplete="new-password"
                  className={classNames('w-full', { 'p-invalid': fieldState.invalid })}
                />
                {errors.value && <span className="text-sm text-red-500 p-error">{errors.value.message}</span>}
              </div>
            </>
          )}
        />
        <button className="btn" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};
