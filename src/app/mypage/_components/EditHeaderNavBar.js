'use client';

import { useState } from 'react';

export default function EditHeaderNavBar({
  title = '제목 없음',
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDiaryMenu, setShowDiaryMenu] = useState(false);

  return (
    <header
      className={`fixed top-0 left-1/2 transform -translate-x-1/2 z-50 max-w-[390px] w-full pt-[50px] pb-[20px] ${className}`}
    >
      <div className="relative flex items-center justify-center mx-auto">
        <h1 className="text-lg font-semibold text-gray-800">{title}</h1>

        <div
          className="absolute left-4 font-normal font-sm text-neutral-400"
          onClick={() => history.back()}
        >
          취소
        </div>
        <div className="absolute right-4 font-normal font-sm text-main-100">
          확인
        </div>
      </div>
    </header>
  );
}
