'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import { MdEditSquare } from 'react-icons/md';
import CollectTabSection from '@/app/diary/_components/CollectTabSection';
import MyDiaryTabSection from '@/app/diary/_components/MyDiaryTabSection';

// 탭 스위처
function DiaryTabs({ tab, onChange }) {
  return (
    <div className="px-4">
      <div className="inline-flex rounded-full p-1 gap-2">
        <button
          className={`px-3 py-1 text-sm rounded-full transition font-normal ${
            tab === 'collect'
              ? 'bg-main-100 text-background'
              : 'bg-main-5 text-main-100'
          }`}
          onClick={() => onChange('collect')}
        >
          일기 모아보기
        </button>
        <button
          className={`px-3 py-1 text-sm rounded-full transition font-normal ${
            tab === 'mine'
              ? 'bg-main-100 text-background'
              : 'bg-main-5 text-main-100'
          }`}
          onClick={() => onChange('mine')}
        >
          내 일기장
        </button>
      </div>
    </div>
  );
}

export default function DiaryPage() {
  const router = useRouter();
  const [tab, setTab] = useState('collect');

  useEffect(() => {
    const saved = sessionStorage.getItem('diaryTab');
    if (saved === 'collect' || saved === 'mine') setTab(saved);
  }, []);
  useEffect(() => {
    sessionStorage.setItem('diaryTab', tab);
  }, [tab]);

  return (
    <div className="min-h-screen pt-24 max-w-[390px] w-screen flex flex-col bg-background">
      <HeaderNavigationBar
        title="일기장"
        showBackButton={true}
        className="bg-background"
      />

      <DiaryTabs tab={tab} onChange={setTab} />

      {tab === 'collect' ? <CollectTabSection /> : <MyDiaryTabSection />}

      <button
        className="fixed bottom-7 left-1/2 -translate-x-1/2 w-[350px] py-2 bg-main-100 text-background rounded-lg text-sm font-medium shadow-md"
        onClick={() => router.push('/diary/write')}
      >
        <div className="flex items-center justify-center gap-2">
          <MdEditSquare className="text-background w-5 h-5" />
          <span className="text-lg">일기 작성하기</span>
        </div>
      </button>
    </div>
  );
}
