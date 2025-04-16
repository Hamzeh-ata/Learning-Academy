import { Controller } from 'react-hook-form';
import classNames from 'classnames';
import { t } from 'i18next';
import { DropZone } from '@shared/components/dropzone';

const acceptedTypes = ['.jpg', '.jpeg', '.png', '.ico', '.svg'];
const acceptedFileTypes = {
  'image/*': acceptedTypes
};
const acceptedFormat = t('dropzone.dynamicAcceptedFiles', {
  types: acceptedTypes.slice(0, acceptedTypes.length - 1).join(', '),
  lastType: acceptedTypes.slice(acceptedTypes.length - 1).join(', ')
});

export const UploadImageField = ({
  name,
  label,
  control,
  rules,
  error,
  multiple = false,
  showUploadedFiles = true,
  clickableDropzone = false,
  containerClassName = 'field'
}) => (
  <div className={containerClassName}>
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <>
          <label htmlFor={field.name} className={classNames({ 'p-error': error })}>
            {label}
          </label>
          <DropZone
            multiple={multiple}
            clickableDropzone={clickableDropzone}
            acceptedFileTypes={acceptedFileTypes}
            showUploadedFiles={showUploadedFiles}
            acceptedFormatText={acceptedFormat}
            onChange={(data) => field.onChange(data.acceptedFiles[0])}
            uploadedAttachments={field.value ? [field.value] : []}
          />

          {error && <span className="text-sm text-red-500">{error.message}</span>}
        </>
      )}
    />
  </div>
);
