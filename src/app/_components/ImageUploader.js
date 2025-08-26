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

  const DEFAULT_IMG = '/images/profileImage_default.svg';

  // 미리보기 URL 생성
  const preview = useMemo(() => {
    if (value instanceof File) return objectUrl || '';
    if (typeof value === 'string' && value) return value;
    return DEFAULT_IMG;
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

  // 기본 이미지 여부 판단
  const isDefault = preview === DEFAULT_IMG;

  const handleOpen = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onChange?.(file);
  };

  const handleReset = () => {
    // 파일 인풋 초기화 (같은 파일 재선택 가능하도록)
    if (inputRef.current) inputRef.current.value = '';
    // 미리보기 URL 정리
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      setObjectUrl(null);
    }
    // 부모로 null 전달해 기본 이미지로 복귀
    onChange?.(null);
  };

  return (
    <div
      className={`inline-flex flex-col items-center ${className}`}
      style={{ width: dim }}
    >
      <div className="relative" style={{ width: dim, height: dim }}>
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
          onClick={handleOpen}
          className="absolute -bottom-2 right-1 w-9 h-9 rounded-full bg-neutral-100 shadow-md grid place-items-center"
        >
          <MdEditSquare className="text-neutral-400 w-4.5 h-4.5" />
        </button>

        {/* 실제 파일 입력 */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* 사진이 선택된 경우에만 노출 */}
      {!isDefault && (
        <button
          type="button"
          onClick={handleReset}
          className="mt-10 text-sm font-light text-background px-2 pb-0.5 pt-1.5 justify-center items-center bg-main-100 rounded-[6px]  whitespace-nowrap"
        >
          기본 프로필로 바꿀래요
        </button>
      )}
    </div>
  );
}
