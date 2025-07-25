'use client';

import { useRouter } from 'next/navigation';
import BackButton from '../_components/BackButton';

export default function HeaderNavigationBar({
  title = '제목 없음',
  showBackButton = true,
  className = '',
}) {
  const router = useRouter();

  return (
    <header
      className={`relative w-full h-[56px] flex items-center justify-center px-4 ${className}`}
    >
      {/* 중앙 타이틀 */}
      <h1 className="text-lg font-semibold text-gray-800 absolute left-1/2 transform -translate-x-1/2">
        {title}
      </h1>

      {/* 뒤로가기 버튼 */}
      {showBackButton && (
        <div className="absolute left-5">
          <BackButton />
        </div>
      )}
    </header>
  );
}
