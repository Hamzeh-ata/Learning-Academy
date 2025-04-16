import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { TextInput, UploadImageField, DropdownField } from '@shared/components/form-elements';
import { addInstructorInformation, updateInstructorInfo } from '@/services/admin-services/user-services';
import { SEX } from '@/constants';

export const InstructorEntry = ({ instructor, onSubmitted }) => {
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
      ...instructor
    });
  };

  useEffect(initializeForm, [instructor, reset]);

  const onSubmit = (data) => {
    const processedData = {
      ...data,
      userId: instructor?.userId
    };
    if (instructor) {
      dispatch(updateInstructorInfo(processedData));
    } else {
      dispatch(addInstructorInformation(processedData));
    }

    onSubmitted();
    reset();
  };

  return (
    <div className="bg-gray-800">
      <form className="text-gray-400 px-2" onSubmit={handleSubmit(onSubmit)}>
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
        <TextInput
          label="Phone NO."
          error={errors.phoneNumber}
          type="phoneNumber"
          register={register('phoneNumber', { required: 'Phone NO. is required' })}
        />

        <TextInput label="Location" error={errors.location} register={register('location')} />

        <DropdownField
          name="sex"
          error={errors.sex}
          label="Gender"
          placeholder="Select a Gender"
          rules={{ required: 'Gender is required.' }}
          control={control}
          filter={false}
          options={SEX}
        />
        <TextInput label="LinkedIn" register={register('linkedIn')} />

        <TextInput label="Twitter" register={register('twitter')} />

        <TextInput label="Facebook" register={register('facebook')} />

        <TextInput label="Instagram" register={register('instagram')} />

        <TextInput label="Bio" error={errors.bio} register={register('bio')} isTextArea />

        <TextInput label="Specialization" register={register('specialization')} isTextArea />

        <TextInput label="Experience" register={register('experience')} isTextArea />

        <TextInput label="Office Hours" register={register('officeHours')} isTextArea />

        <UploadImageField name="image" label="Photo" error={errors.image} control={control} />

        <button className="btn" type="submit">
          {instructor ? 'Update Instructor' : 'Add Instructor'}
        </button>
      </form>
    </div>
  );
};
