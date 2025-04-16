import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { updateStudentInfo } from '@/services/admin-services/user-services';
import { TextInput, NumberInput, DatePickerField, UploadImageField } from '@shared/components/form-elements';

export const StudentEntry = ({ student, onSubmitted }) => {
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
      firstName: student?.firstName || '',
      lastName: student?.lastName || '',
      email: student?.email || '',
      userName: student?.email || '',
      phoneNumber: student?.phoneNumber || '',
      birthDate: new Date(student?.birthDate) || '',
      sex: student?.sex || '',
      university: student?.university || '',
      image: student?.image || ''
    });
  }, [student, reset]);

  const onSubmit = (data) => {
    if (data.birthDate) {
      const formattedDate = new Date(data.birthDate);
      formattedDate.setHours(0, 0, 0, 0);
      data.birthDate = formattedDate.toDateString();
    }
    if (student) {
      dispatch(updateStudentInfo({ ...data, id: student.id }));
    }
    onSubmitted();
    reset();
  };

  return (
    <div className="bg-gray-800">
      <h3 className="text-gray-300 text-lg mt-2"> {student ? 'Update' : 'Add'} student</h3>
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
          type="email"
          error={errors.email}
          register={register('email', { required: 'Email is required' })}
        />

        <TextInput label="User Name" type="email" register={register('userName')} />

        <NumberInput
          name="phoneNumber"
          label="Phone Number"
          control={control}
          error={errors.phoneNumber}
          rules={{ required: 'Phone Number is required' }}
        />
        <DatePickerField name="birthDate" label="Birth Date" control={control} error={errors.birthDate} />

        <TextInput label="Gender" type="sex" error={errors.sex} register={register('sex')} />

        <TextInput label="university" type="University" register={register('university')} />

        <UploadImageField name="image" label="Photo" control={control} />

        <button className="btn" type="submit">
          Update student Info
        </button>
      </form>
    </div>
  );
};
