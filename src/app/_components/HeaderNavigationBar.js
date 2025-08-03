'use client';

import { useRouter } from 'next/navigation';
import BackButton from '../_components/BackButton';
import TaskInfoModal from '../collection/_components/Task/TaskInfoModal';
import { useState } from 'react';

export default function HeaderNavigationBar({
  title = '제목 없음',
  showBackButton = true,
  className = '',
  type = 'general',
  lv = 0,
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header
      className={`fixed top-0 z-50 max-w-[390px] w-full pt-[50px] pb-[20px] ${className}`}
    >
      <div className="relative w-full flex items-center justify-center mx-auto">
        {/* 중앙 타이틀 */}
        {type === 'collection' && (
          <div className="bg-sub-5 px-1 py-1 text-xs text-sub-100 mr-2">
            Lv.{lv}
          </div>
        )}
        <h1 className="text-lg font-semibold text-gray-800">{title}</h1>

        {/* 뒤로가기 버튼 */}
        {showBackButton && (
          <div className="absolute left-5">
            <BackButton />
          </div>
        )}
        {type === 'collection' && (
          <i
            className="absolute right-5 mgc_information_fill text-neutral-500 text-xl"
            onClick={() => setIsOpen(true)}
          />
        )}
      </div>
      <TaskInfoModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </header>
  );
}
