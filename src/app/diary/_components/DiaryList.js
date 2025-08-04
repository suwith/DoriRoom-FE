'use client';

import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import { MdEditSquare } from 'react-icons/md';
import DiaryListItem from './DiaryListItem';

export default function DiaryList({ date, diaries }) {
  return (
    <div className="min-h-screen pt-20 pb-28">
      <HeaderNavigationBar title={`${date} 일기`} showBackButton={true} />

      <div className="px-4 space-y-4 pt-5">
        {diaries.map((diary) => (
          <DiaryListItem key={diary.id} diary={diary} />
        ))}
      </div>

      <button className="fixed bottom-7 left-1/2 -translate-x-1/2 w-[350px] py-2 bg-main-100 text-white rounded-lg text-sm font-medium shadow-md">
        <div className="flex items-center justify-center gap-2">
          <MdEditSquare className="text-white w-5 h-5" />
          <span className="text-lg">일기 작성하기</span>
        </div>
      </button>
    </div>
  );
}
