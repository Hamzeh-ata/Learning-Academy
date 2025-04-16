import { Controller } from 'react-hook-form';
import { InputSwitch } from 'primereact/inputswitch';

export const SwitchButtonField = ({ name, label, control, rules, error }) => (
  <div className="field">
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <>
          <label htmlFor={field.name}>{label}</label>
          <InputSwitch
            inputId={field.name}
            checked={field.value}
            inputRef={field.ref}
            onChange={(e) => field.onChange(e.value)}
          />
          {error && <span className="text-sm text-red-500">{error.message}</span>}
        </>
      )}
    />
  </div>
);
