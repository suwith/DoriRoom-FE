// app/_components/PrimaryButton.jsx
'use client';

export default function PrimaryButton({
  children,
  disabled,
  onClick,
  type = 'button',
  className = '',
  ...rest
}) {
  return (
    <button
      {...rest}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`w-full rounded-lg py-3 font-medium transition text-center text-xl text-background
        ${!disabled ? 'bg-main-100 ' : 'bg-neutral-300 '}
        disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}
