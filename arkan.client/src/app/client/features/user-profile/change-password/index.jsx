import { useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { updateUserPassword } from '@services/client-services/user-profile.service';
import { Password } from 'primereact/password';
import classNames from 'classnames';
import alertService from '@services/alert/alert.service';

export const ChangePassword = ({ onSubmitted }) => {
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ defaultValues: { password: '' } });

  const onSubmit = async (data) => {
    try {
      await dispatch(updateUserPassword(data.password));
      alertService.showToast({ type: 'success', title: 'Password Updated Successfully!' });
      onSubmitted();
    } catch (e) {
      console.error(e);
    }
    reset();
  };
  return (
    <div className="">
      <h3 className="text-gray-700 text-lg mt-2"> Change Password</h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="text-gray-400 px-5 py-5 overflow-y-auto max-h-[calc(100vh-250px)]"
        autoComplete="off"
      >
        <Controller
          name="password"
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
            <div className="field">
              <label htmlFor={field.name} className={classNames({ 'p-error': errors.password })}>
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
              {errors.password && <span className="text-sm text-red-500 p-error">{errors.password.message}</span>}
            </div>
          )}
        />
        <button className="btn mt-4" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};
