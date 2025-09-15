'use client';

import { useEffect, useState } from 'react';
import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import { MdEditSquare } from 'react-icons/md';
import DiaryListItem from './DiaryListItem';
import { useRouter } from 'next/navigation';

export default function DiaryList({ date, diaries: initialDiaries, type }) {
  const router = useRouter();
  const [diaries, setDiaries] = useState(initialDiaries);

  // props 변경 시 동기화
  useEffect(() => {
    setDiaries(initialDiaries);
  }, [initialDiaries]);

  const handleDeleted = (id) => {
    setDiaries((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="min-h-screen header-padding-tb w-screen pb-28 bg-neutral-100">
      <HeaderNavigationBar
        title={`${date} 일기`}
        showBackButton={true}
        className="bg-neutral-100"
      />

      <div className="px-4 space-y-4">
        {diaries.map((diary) => (
          <DiaryListItem
            key={diary.id}
            diary={diary}
            onDeleted={handleDeleted}
            type={type}
          />
        ))}
      </div>

      {type !== 'neighbor' && (
        <button
          className="fixed btn-fixed-b left-1/2 -translate-x-1/2 w-[90%] py-2 bg-main-100 text-background rounded-lg text-sm font-medium shadow-md"
          onClick={() => router.push('/diary/write')}
        >
          <div className="flex items-center justify-center gap-2">
            <MdEditSquare className="text-background w-5 h-5" />
            <span className="text-lg">일기 작성하기</span>
          </div>
        </button>
      )}
    </div>
  );
}
