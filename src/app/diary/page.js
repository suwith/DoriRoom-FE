'use client';

import { useState } from 'react';
import { mockDiaries } from './mockData';
import DiaryCalendar from './_components/DiaryCalendar';
import ReviewItem from '../festival/_components/ReviewItem';
import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';

export default function DiaryPage() {
  const [likedIds, setLikedIds] = useState([]);

  const handleLike = (id) => {
    setLikedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // 오늘 날짜 기준 필터 (나중에 동적으로 바꾸면 됨)
  const today = '2025-08-01'; // 임시 하드코딩
  const todayPublicDiaries = mockDiaries.filter(
    (d) => d.date === today && d.isPublic
  );

  return (
    <div className="space-y-2 min-h-screen">
      <HeaderNavigationBar title={'일기장'} showBackButton={true} />

      <DiaryCalendar
        diaries={mockDiaries}
        onDateClick={(date) => {
          console.log('날짜 클릭됨:', date); // 이후 분기 로직 추가 예정
        }}
      />

      {todayPublicDiaries.length > 0 && (
        <section className="space-y-4 px-4">
          <h2 className="text-md font-bold mt-4 text-neutral-800">
            친구가 새로 글을 업로드했어요! ☕️
          </h2>
          <div className="space-y-6">
            {todayPublicDiaries.map((diary) => (
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
    </div>
  );
}
