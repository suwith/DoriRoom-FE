'use client';

export default function TextInput({
  id,
  label,
  type = 'text',
  placeholder = '',
  autoComplete,
  value,
  onChange,
  required = false,
  minLength,
  maxLength,
  className = '',
}) {
  return (
    <div className={className}>
      {label ? (
        <label htmlFor={id} className="block font-medium">
          {label}
        </label>
      ) : null}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="mt-3 w-full rounded-[10px] bg-neutral-100 placeholder-neutral-300 px-4 py-3
                   focus:outline-none focus:ring-0 focus:bg-neutral-100"
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
      />
    </div>
  );
}
