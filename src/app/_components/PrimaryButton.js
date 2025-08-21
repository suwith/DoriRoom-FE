// app/_components/PrimaryButton.jsx
'use client';

export default function PrimaryButton({
  children,
  disabled,
  onClick,
  type = 'button',
  className = '',
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`w-full rounded-xl py-3 font-semibold transition
        ${!disabled ? 'bg-emerald-500 text-white' : 'bg-gray-300 text-white'}
        disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}
