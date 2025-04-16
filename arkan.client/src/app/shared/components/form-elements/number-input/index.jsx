import { Controller } from 'react-hook-form';
import { InputNumber } from 'primereact/InputNumber';
import classNames from 'classnames';

export const NumberInput = ({ name, label, control, rules, error, min = 0 }) => (
  <div className="field">
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <>
          <label htmlFor={field.name}>{label}</label>
          <InputNumber
            id={field.name}
            value={field.value}
            onValueChange={(e) => field.onChange(e.value)}
            onBlur={field.onBlur}
            useGrouping={false}
            min={min}
            className="w-full"
            inputClassName={classNames({ 'p-invalid': fieldState.invalid })}
          />
          {error && <span className="text-sm text-red-500">{error.message}</span>}
        </>
      )}
    />
  </div>
);
