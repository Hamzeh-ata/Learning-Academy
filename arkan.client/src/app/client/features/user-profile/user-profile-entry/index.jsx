import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { updateUserProfile } from '@services/client-services/user-profile.service';
import {
  TextInput,
  UploadImageField,
  DatePickerField,
  DropdownField,
  SwitchButtonField
} from '@shared/components/form-elements';
import { useIsStudent } from '@hooks';
import './user-profile-entry.css';
import { SEX } from '@/constants';

export const UserProfileEntry = ({ user, onSubmitted }) => {
  const dispatch = useDispatch();
  const isStudent = useIsStudent();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const initializeForm = () => {
    reset({
      ...user,
      birthDate: user?.birthDate ? new Date(user.birthDate) : ''
    });
  };

  useEffect(initializeForm, [user, reset]);

  const onSubmit = (data) => {
    const processedData = {
      ...data,
      birthDate: isStudent ? data.birthDate?.toDateString() : ''
    };

    if (user) {
      dispatch(updateUserProfile(processedData));
    }

    onSubmitted();
    reset();
  };

  return (
    <form className="text-gray-400 p-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex 2xl:space-x-2 lg:space-x-2 flex-wrap md:flex-nowrap">
        <div className="w-full text-center md:text-left md:w-2/5 lg:w-1/3">
          <UploadImageField
            clickableDropzone
            containerClassName="w-full text-black font-semibold"
            className="w-full"
            name="image"
            label="Profile Image"
            error={errors.image}
            showUploadedFiles={false}
            control={control}
          />
        </div>
        <div className="flex gap-2 flex-wrap md:w-[66%] lg:w-2/3">
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

          {!isStudent && (
            <SwitchButtonField
              name="showStudentsCount"
              label="Show Number of students in public profile"
              control={control}
            />
          )}

          {isStudent && (
            <>
              <TextInput label="university" type="University" register={register('university')} />
              <DatePickerField
                name="birthDate"
                label="Birth Date"
                rules={{ required: 'Birth Date is required.' }}
                control={control}
                error={errors.birthDate}
              />
            </>
          )}

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
        </div>
      </div>
      {!isStudent && (
        <div className="px-0 py-4">
          <div className="flex flex-wrap gap-4 instructor-info">
            <TextInput label="Location" error={errors.location} register={register('location')} />

            <TextInput label="LinkedIn" register={register('linkedIn')} />

            <TextInput label="Twitter" register={register('twitter')} />

            <TextInput label="Facebook" register={register('facebook')} />

            <TextInput label="Instagram" register={register('instagram')} />

            <TextInput label="Specialization" register={register('specialization')} isTextArea />

            <TextInput label="Experience" register={register('experience')} isTextArea />

            <TextInput label="Office Hours" register={register('officeHours')} isTextArea />

            <TextInput label="Bio" error={errors.bio} register={register('bio')} isTextArea />
          </div>
        </div>
      )}

      <button className="btn text-end mt-2 md:mt-0" type="submit">
        Submit
      </button>
    </form>
  );
};
