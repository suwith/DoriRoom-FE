'use client';

import { useRouter } from 'next/navigation';
import { IoArrowBack } from 'react-icons/io5';

export default function HeaderBar({
  title = '제목 없음',
  showBackButton = true,
}) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <header className="max-w-[390px] w-full h-[56px] flex items-end justify-center px-4 shadow-md bg-white fixed top-0 z-50 pt-[90px] pb-[10px]">
      {/* 중앙 타이틀 */}
      <h1 className="text-lg font-semibold text-gray-800 absolute left-1/2 transform -translate-x-1/2">
        {title}
      </h1>

      {/* 뒤로가기 버튼 (좌측 고정) */}
      {showBackButton && (
        <button
          onClick={handleBack}
          className="text-2xl text-gray-700 absolute left-4"
        >
          <IoArrowBack />
        </button>
      )}
    </header>
  );
}
