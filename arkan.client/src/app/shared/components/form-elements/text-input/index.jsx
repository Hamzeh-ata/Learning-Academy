export const TextInput = ({
  label,
  error,
  register,
  isTextArea = false,
  type = 'text',
  disabled = false,
  autoComplete = 'off',
  containerClassName = 'field',
  inputClassName = '',
  postFix
}) => (
  <div className={containerClassName}>
    <label>{label}</label>
    {isTextArea ? (
      <textarea className={inputClassName} disabled={disabled} {...register} />
    ) : (
      <div className="flex">
        <input className={inputClassName} autoComplete={autoComplete} disabled={disabled} type={type} {...register} />
        {postFix}
      </div>
    )}
    {error && <span className="text-sm text-red-500">{error.message}</span>}
  </div>
);
