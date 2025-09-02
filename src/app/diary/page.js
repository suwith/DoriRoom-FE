// app/diary/page.jsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isWithinInterval, parse, subDays } from 'date-fns';

import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import DiaryCalendar from './_components/DiaryCalendar';
import ReviewItem from '../festival/_components/ReviewItem';
import { mockDiaries } from './mockData';
import { MdEditSquare } from 'react-icons/md';
import DiaryCard from '@/app/diary/_components/DiaryCard';

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

// 일기 모아보기 탭 전용 섹션
function CollectTabSection({ likedIds, onLike, onItemClick }) {
  return (
    <div className="space-y-10">
      <section className="px-4 mt-4">
        <div className="flex items-center gap-1 mb-3">
          <div className="text-md font-bold ">이달의 인기글 ✨</div>
        </div>

        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {mockDiaries.map((it) => (
            <DiaryCard key={it.id} item={it} onClick={onItemClick} />
          ))}
        </div>
      </section>
      <section className="px-4 pb-24">
        <div className="flex items-center gap-1 mb-3">
          <div className="text-md font-bold ">단짝 도리 일기 모아보기 🔍</div>
        </div>
        <div>
          {mockDiaries.map((diary) => (
            <ReviewItem
              key={diary.id}
              review={diary}
              isLiked={likedIds.includes(diary.id)}
              onLike={onLike}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

// 내 일기장 탭 전용 섹션
function MyDiaryTabSection({ diaries, onDateClick, likedIds, onLike }) {
  const sorted = useMemo(() => {
    return [...diaries].sort((a, b) => {
      const da = parse(a.date, 'yyyy.MM.dd', new Date());
      const db = parse(b.date, 'yyyy.MM.dd', new Date());
      return db - da;
    });
  }, [diaries]);

  return (
    <>
      <div className="px-10 mt-3">
        <DiaryCalendar diaries={diaries} onDateClick={onDateClick} />
      </div>
      <section className="px-4 pb-24">
        <div className="flex items-center gap-1 mb-3">
          <div className="text-md font-bold ">내 일기 모아보기 🔍</div>
        </div>
        {sorted.map((diary) => (
          <div key={diary.id}>
            <ReviewItem
              review={diary}
              isLiked={likedIds.includes(diary.id)}
              onLike={onLike}
              type="mine"
            />
          </div>
        ))}
      </section>
    </>
  );
}

export default function DiaryPage() {
  const router = useRouter();
  const [tab, setTab] = useState('collect');
  const [likedIds, setLikedIds] = useState([]);

  useEffect(() => {
    const saved = sessionStorage.getItem('diaryTab');
    if (saved === 'collect' || saved === 'mine') setTab(saved);
  }, []);
  useEffect(() => {
    sessionStorage.setItem('diaryTab', tab);
  }, [tab]);

  const handleLike = (id) => {
    setLikedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const today = new Date();
  const oneWeekAgo = subDays(today, 6);

  const recentPublicDiaries = useMemo(() => {
    return mockDiaries
      .filter((d) => {
        if (!d.isPublic) return false;
        const diaryDate = parse(d.date, 'yyyy.MM.dd', new Date());
        return isWithinInterval(diaryDate, { start: oneWeekAgo, end: today });
      })
      .sort((a, b) => {
        const da = parse(a.date, 'yyyy.MM.dd', new Date());
        const db = parse(b.date, 'yyyy.MM.dd', new Date());
        return db - da;
      });
  }, [today, oneWeekAgo]);

  const handleDateClick = (isoDate) => {
    const formatted = isoDate.replace(/-/g, '.');
    const diariesForDate = mockDiaries.filter((d) => d.date === formatted);

    if (diariesForDate.length === 1) {
      router.push(`/diary/${diariesForDate[0].id}`);
    } else if (diariesForDate.length > 1) {
      router.push(`/diary/date/${formatted}`);
    }
  };

  return (
    <div className="min-h-screen pt-24">
      <HeaderNavigationBar
        title="일기장"
        showBackButton={true}
        className="bg-background"
      />

      <div className="mt-1">
        <DiaryTabs tab={tab} onChange={setTab} />
      </div>

      {tab === 'collect' ? (
        <CollectTabSection
          likedIds={likedIds}
          onLike={handleLike}
          onItemClick={(id) => router.push(`/diary/${id}`)}
        />
      ) : (
        <MyDiaryTabSection
          diaries={mockDiaries}
          onDateClick={handleDateClick}
          likedIds={likedIds}
          onLike={handleLike}
        />
      )}

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
