import { DropdownField, TextInput } from '@/app/shared/components/form-elements';
import { DROP_DOWN_TYPES, NOTIFICATION_AUDIENCE, NOTIFICATION_TYPE } from '@/constants';
import { useDropdownData } from '@/hooks';
import { adminNotificationsThunks } from '@/slices/admin-slices/admin-notifications.slice';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

export function NotificationEntry({ onSubmitted, notification }) {
  const dispatch = useDispatch();
  const { courses, packages } = useDropdownData([DROP_DOWN_TYPES.Courses, DROP_DOWN_TYPES.Packages]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm();

  const notificationType = watch('type');

  function getAudienceTypes() {
    return Object.entries(NOTIFICATION_AUDIENCE).map(([key, value]) => ({ id: value, name: key }));
  }

  function getNotificationTypes() {
    return Object.entries(NOTIFICATION_TYPE).map(([key, value]) => ({ id: value, name: key }));
  }

  const initializeForm = () => {
    let selectedNotificationType = null;
    if (notification && notification.itemId) {
      selectedNotificationType = notificationTypeItems[notification.type]?.find(
        (item) => item.id === notification.itemId
      );
    }

    reset({
      ...notification,
      itemId: selectedNotificationType?.id || null
    });
  };

  useEffect(initializeForm, [notification, reset]);

  const notificationTypeItems = {
    [NOTIFICATION_TYPE.Course]: courses,
    [NOTIFICATION_TYPE.Package]: packages,
    [NOTIFICATION_TYPE.Announcements]: []
  };

  const onSubmit = (data) => {
    if (notification) {
      data.id = notification.id;
      dispatch(adminNotificationsThunks.update(data));
    } else {
      dispatch(adminNotificationsThunks.create(data));
    }

    onSubmitted();
    reset();
  };

  return (
    <div className="bg-gray-800">
      <form className="text-gray-400 px-2" onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          label="Content"
          error={errors.message}
          isTextArea
          register={register('message', { required: 'Content is required' })}
        />

        <DropdownField
          name="audience"
          label="Audiences"
          error={errors.audience}
          placeholder="Select Audiences"
          rules={{ required: 'Audience is required' }}
          control={control}
          options={getAudienceTypes()}
        />

        <DropdownField
          name="type"
          error={errors.type}
          label="Notification Type"
          placeholder="Select a Notification Type"
          rules={{ required: 'Notification type is required.' }}
          control={control}
          options={getNotificationTypes()}
          onChange={() => setValue('itemId', null)}
        />

        {notificationType != null && notificationType != NOTIFICATION_TYPE.Announcements && (
          <DropdownField
            name="itemId"
            error={errors.itemId}
            label="Notification Type Item"
            placeholder="Select a Notification Type Item"
            rules={{ required: 'Notification type item is required.' }}
            control={control}
            options={notificationTypeItems[notificationType]}
          />
        )}

        <button className="btn" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
