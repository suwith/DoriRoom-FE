// app/_components/ImageUploader.jsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { MdEditSquare } from 'react-icons/md';

// value: File | string(이미지URL) | null
export default function ImageUploader({
  value,
  onChange,
  size = 160,
  rounded = true,
  className = '',
  ariaLabel = '프로필 이미지 선택',
}) {
  const inputRef = useRef(null);
  const [objectUrl, setObjectUrl] = useState(null);

  // 미리보기 URL 생성
  const preview = useMemo(() => {
    if (value instanceof File) return objectUrl || '';
    if (typeof value === 'string' && value) return value;
    return '/images/profileImage_default.svg';
  }, [value, objectUrl]);

  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setObjectUrl(null);
  }, [value]);

  const dim = `${size}px`;
  const radius = rounded ? 'rounded-full' : 'rounded-xl';

  return (
    <div className={`relative inline-block ${className}`} style={{ width: dim, height: dim }}>
      <img
        src={preview}
        alt="프로필 이미지"
        className={`w-full h-full object-cover ${radius}`}
        draggable={false}
      />

      {/* 편집 버튼 오버레이 */}
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={() => inputRef.current?.click()}
        className="absolute -bottom-2 right-1 w-9 h-9 rounded-full bg-neutral-100 shadow-mdgrid place-items-center"
      >
        <MdEditSquare className="text-neutral-400 w-4.5 h-4.5" />
      </button>

      {/* 실제 파일 입력 */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onChange?.(file);
        }}
      />
    </div>
  );
}
