import { Controller } from 'react-hook-form';
import classNames from 'classnames';
import { Calendar } from 'primereact/calendar';

export const DatePickerField = ({
  name,
  label,
  control,
  rules,
  error,
  dateFormat = 'yy-mm-dd',
  showTime = false,
  placeholder = 'yyyy-mm-dd',
  showIcon = true,
  containerClassName = 'field',
  appendTo = undefined
}) => (
  <div className={containerClassName}>
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <>
          <label htmlFor={field.name} className={classNames({ 'p-error': error })}>
            {label}
          </label>
          <Calendar
            id={field.name}
            value={field.value ? new Date(field.value) : null}
            onChange={(e) => field.onChange(e.value)}
            dateFormat={dateFormat}
            showIcon={showIcon}
            showTime={showTime}
            inputClassName={classNames({ 'p-invalid': fieldState.error })}
            placeholder={placeholder}
            appendTo={appendTo}
          />

          {error && <span className="text-sm text-red-500">{error.message}</span>}
        </>
      )}
    />
  </div>
);
