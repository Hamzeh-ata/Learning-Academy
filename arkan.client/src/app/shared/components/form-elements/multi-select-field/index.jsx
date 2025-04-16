import { Controller } from 'react-hook-form';
import { MultiSelect } from 'primereact/multiselect';
import classNames from 'classnames';

export const MultiSelectField = ({
  name,
  label,
  control,
  rules,
  error,
  placeholder = 'Please select a value',
  options = [],
  filter = true,
  maxSelectedLabels = 3,
  virtualScrollerOptions
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
          <MultiSelect
            id={field.name}
            value={field.value}
            options={options}
            onChange={(e) => field.onChange(e.value)}
            display="chip"
            optionLabel="name"
            optionValue="id"
            filter={filter}
            virtualScrollerOptions={virtualScrollerOptions}
            placeholder={placeholder}
            maxSelectedLabels={maxSelectedLabels}
            className="w-full bg-slate-700 py-1 rounded-md pl-3"
          />

          {error && <span className="text-sm text-red-500">{error.message}</span>}
        </>
      )}
    />
  </div>
);
