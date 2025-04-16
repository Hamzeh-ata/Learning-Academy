import { DatePickerField, DropdownField, NumberInput, TextInput } from '@/app/shared/components/form-elements';
import { LiveSessionStatus } from '@/constants';
import { liveStreamThunks } from '@/services/client-services/live-stream.service';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

export function LiveStreamEntry({ liveStream, onSubmitted, courses }) {
  const dispatch = useDispatch();
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm();

  const startDateValue = watch('startTime');

  const initializeForm = () => {
    let selectedCourse = null;

    if (liveStream && liveStream.courseId) {
      selectedCourse = courses?.find((item) => item.id === liveStream.courseId);
    }
    reset({
      ...liveStream,
      courseId: selectedCourse?.id || null,
      status: liveStream?.status || LiveSessionStatus.Pending,
      startTime: liveStream?.startTime ? new Date(liveStream.startTime) : '',
      endTime: liveStream?.endTime ? new Date(liveStream.endTime) : '',
      isStarted: liveStream?.isStarted || false,
      usersCount: liveStream?.usersCount || 0
    });
  };

  useEffect(initializeForm, [liveStream, reset]);

  const onSubmit = (data) => {
    const processedData = {
      ...data,
      isStarted: Boolean(data.isStarted)
    };
    if (liveStream) {
      processedData.id = liveStream.id;
      dispatch(liveStreamThunks.update(processedData));
    } else {
      dispatch(liveStreamThunks.create(processedData));
    }

    onSubmitted();
    reset();
  };

  return (
    <form className="text-gray-400 p-4 w-full h-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <TextInput label="Title" error={errors.title} register={register('title', { required: 'Title is required' })} />

      <TextInput
        label="Description"
        error={errors.description}
        register={register('description', { required: 'Description is required' })}
      />

      <DropdownField
        label="Course"
        error={errors.courseId}
        control={control}
        name="courseId"
        options={courses}
        placeholder="Select Course"
        rules={{ required: 'Course is required.' }}
      />

      <NumberInput
        name="usersCount"
        label="Users Limit"
        control={control}
        rules={{ required: 'users limit is required' }}
        error={errors.usersCount}
      />

      <div className="flex">
        <DatePickerField
          name="startTime"
          label="Start Date"
          rules={{
            required: 'Start Date is required'
          }}
          control={control}
          error={errors.startTime}
        />

        <DatePickerField
          name="endTime"
          label="End Date"
          rules={{
            required: 'End Date is required',
            validate: (endDate) =>
              new Date(endDate) > new Date(startDateValue) || 'End Date must be after the Start Date'
          }}
          control={control}
          error={errors.endTime}
        />
      </div>

      <button className="btn" type="submit">
        {liveStream ? 'Update' : 'Add'} live Stream
      </button>
    </form>
  );
}
