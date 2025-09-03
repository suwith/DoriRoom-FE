'use client';

import { useMemo } from 'react';
import { parse } from 'date-fns';
import DiaryCalendar from './DiaryCalendar';
import ReviewItem from '@/app/festival/_components/ReviewItem';
import { mockDiaries } from '@/app/diary/mockData';
import { useRouter } from 'next/navigation';

export default function MyDiaryTabSection() {
  const router = useRouter();
  const sorted = useMemo(() => {
    return [...mockDiaries].sort((a, b) => {
      const da = parse(a.date, 'yyyy.MM.dd', new Date());
      const db = parse(b.date, 'yyyy.MM.dd', new Date());
      return db - da;
    });
  }, [mockDiaries]);

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
    <>
      <div className="px-10 mt-3">
        <DiaryCalendar diaries={mockDiaries} onDateClick={handleDateClick} />
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
