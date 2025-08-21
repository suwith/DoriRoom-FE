// app/_components/forms/PasswordInput.jsx
'use client';

import { useState } from 'react';

export default function PasswordInput({
  id,
  label = '비밀번호',
  placeholder = '비밀번호',
  autoComplete = 'current-password',
  value,
  onChange,
  required = true,
  className = '',
}) {
  const [show, setShow] = useState(false);

  return (
    <div className={className}>
      {label ? (
        <label htmlFor={id} className="block text-sm font-medium text-gray-800">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="mt-3 w-full rounded-[10px] bg-neutral-100 placeholder-neutral-300 px-4 py-3
                     focus:outline-none focus:ring-0 focus:bg-neutral-100 pr-12"
          value={value}
          onChange={onChange}
          required={required}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute justify-center right-4 top-9 -translate-y-1/2 text-sm text-neutral-500"
          aria-label={show ? '비밀번호 숨기기' : '비밀번호 보기'}
        >
          {show ? '숨김' : '보기'}
        </button>
      </div>
    </div>
  );
}
