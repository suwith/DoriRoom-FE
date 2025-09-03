'use client';

import { useMemo } from 'react';
import { parse } from 'date-fns';
import DiaryCalendar from './DiaryCalendar';
import ReviewItem from '@/app/festival/_components/ReviewItem';

export default function MyDiaryTabSection({ diaries, onDateClick }) {
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
          <div className="text-md font-bold">내 일기 모아보기 🔍</div>
        </div>
        {sorted.map((diary) => (
          <div key={diary.id}>
            <ReviewItem review={diary} type="mine" />
          </div>
        ))}
      </section>
    </>
  );
}
