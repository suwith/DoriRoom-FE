'use client';

import { useState } from 'react';
import { mockDiaries } from './mockData';
import DiaryCalendar from './_components/DiaryCalendar';
import ReviewItem from '../festival/_components/ReviewItem';
import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import { isWithinInterval, parse, subDays } from 'date-fns';
import { MdEditSquare } from 'react-icons/md';
import { useRouter } from 'next/navigation';

export default function DiaryPage() {
  const [likedIds, setLikedIds] = useState([]);
  const router = useRouter();

  const handleLike = (id) => {
    setLikedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const today = new Date();
  const oneWeekAgo = subDays(today, 6); // 오늘 포함 7일치 (오늘 ~ 6일 전)

  const recentPublicDiaries = mockDiaries
    .filter((d) => {
      if (!d.isPublic) return false;

      const diaryDate = parse(d.date, 'yyyy.MM.dd', new Date());

      return isWithinInterval(diaryDate, {
        start: oneWeekAgo,
        end: today,
      });
    })
    .sort((a, b) => {
      const dateA = parse(a.date, 'yyyy.MM.dd', new Date());
      const dateB = parse(b.date, 'yyyy.MM.dd', new Date());
      return dateB - dateA; // 최신순 정렬
    });

  const handleDateClick = (isoDate) => {
    const formattedDate = isoDate.replace(/-/g, '.');
    const diariesForDate = mockDiaries.filter((d) => d.date === formattedDate);

    if (diariesForDate.length === 1) {
      router.push(`/diary/${diariesForDate[0].id}`); // 상세 페이지
    } else if (diariesForDate.length > 1) {
      router.push(`/diary/date/${formattedDate}`); // 목록 페이지
    } else {
    }
  };
  return (
    <div className="space-y-2 min-h-screen pt-20">
      <HeaderNavigationBar
        title={'일기장'}
        showBackButton={true}
        className="bg-background"
      />

      <DiaryCalendar diaries={mockDiaries} onDateClick={handleDateClick} />

      {recentPublicDiaries.length > 0 && (
        <section className="space-y-4 px-4 pb-20">
          <h2 className="text-md font-bold mt-4 text-neutral-800">
            친구가 새로 글을 업로드했어요! ☕️
          </h2>
          <div className="space-y-2">
            {recentPublicDiaries.map((diary) => (
              <ReviewItem
                key={diary.id}
                review={{
                  id: diary.id,
                  nickname: diary.authorName,
                  content: diary.content,
                  images: diary.images,
                  date: diary.date,
                  likes: 0,
                }}
                isLiked={likedIds.includes(diary.id)}
                onLike={handleLike}
              />
            ))}
          </div>
        </section>
      )}

      <button className="fixed bottom-7 left-1/2 -translate-x-1/2 w-[350px] py-2 bg-main-100 text-white rounded-lg text-sm font-medium shadow-md">
        <div
          className="flex items-center justify-center gap-2"
          onClick={() => {
            router.push('/diary/write');
          }}
        >
          {' '}
          <MdEditSquare className="text-white w-5 h-5" />
          <span className="text-lg">일기 작성하기</span>
        </div>
      </button>
    </div>
  );
}
