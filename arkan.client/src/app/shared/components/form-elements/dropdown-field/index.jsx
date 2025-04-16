import { Controller } from 'react-hook-form';
import { Dropdown } from 'primereact/dropdown';
import classNames from 'classnames';

export const DropdownField = ({
  name,
  label,
  control,
  rules,
  error,
  virtualScrollerOptions,
  placeholder = 'Please select a value',
  options = [],
  filter = true,
  onChange,
  appendTo = undefined
}) => (
  <div className="field">
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <>
          <label htmlFor={field.name} className={classNames({ 'p-error': error })}>
            {label}
          </label>
          <Dropdown
            id={field.name}
            value={field.value}
            optionLabel="name"
            filter={filter}
            optionValue="id"
            placeholder={placeholder}
            options={options}
            virtualScrollerOptions={virtualScrollerOptions}
            focusInputRef={field.ref}
            appendTo={appendTo}
            onChange={(e) => {
              field.onChange(e.value);
              onChange && onChange(e.value);
            }}
          />

          {error && <span className="text-sm text-red-500">{error.message}</span>}
        </>
      )}
    />
  </div>
);
