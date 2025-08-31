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
  explanation = '',
  onClick,
}) {
  return (
    <div className={className}>
      {label ? (
        <label htmlFor={id} className="block font-medium">
          {label}
        </label>
      ) : null}
      <div className="flex gap-2 mt-3">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="flex-3 w-full rounded-[10px] bg-neutral-100 placeholder-neutral-300 px-4 py-3
                   focus:outline-none focus:ring-0 focus:bg-neutral-100"
          value={value}
          onChange={onChange}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
        />
        <button
          className={`flex-1 rounded-lg px-2 font-semibold text-background ${value.length > 1 ? 'bg-main-100' : 'bg-neutral-300'}`}
          onClick={onClick}
        >
          중복 확인
        </button>
      </div>
      <label
        htmlFor={id}
        className="block font-normal text-xs text-neutral-600 mt-2"
      >
        {explanation}
      </label>
    </div>
  );
}
