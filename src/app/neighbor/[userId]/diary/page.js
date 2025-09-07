'use client';

import { useParams, useRouter } from 'next/navigation';
import useNeighborRoom from '@/hooks/follow/useNeighborRoom';
import useUserDiaries from '@/hooks/diary/useUserDiaries';
import LoadingContent from '@/app/_components/LoadingContent';
import DiaryCalendar from '@/app/diary/_components/DiaryCalendar';
import ReviewItem from '@/app/festival/_components/ReviewItem';
import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import React, { useEffect } from 'react';

export default function NeighborDiary() {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId;
  const { room, fetchRoom, loading: roomLoading } = useNeighborRoom(userId);

  useEffect(() => {
    fetchRoom();
  }, [fetchRoom]);

  // 캘린더용 → 전체 일기 조회
  const { diaries: allDiaries, loading: calendarLoading } = useUserDiaries({
    userId: userId,
    paging: false,
  });

  // 목록용 → 페이지네이션
  const { diaries, loading, error, hasMore, loadMore } = useUserDiaries({
    userId: userId,
    pageSize: 10,
    paging: true,
  });

  const handleDateClick = (isoDate) => {
    const formatted = isoDate.replace(/-/g, '.');
    const diariesForDate = allDiaries.filter((d) => d.date === isoDate);

    if (diariesForDate.length === 1) {
      router.push(`/neighbor/${room.userId}/diary/${diariesForDate[0].id}`);
    } else if (diariesForDate.length > 1) {
      router.push(`/neighbor/${room.userId}/diary/date/${formatted}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background pt-20">
      <HeaderNavigationBar
        title={room && `${room?.nickname} 님의 일기장`}
        showBackButton={true}
        className="bg-background"
      />
      <div className="px-10 mt-3">
        {calendarLoading ? (
          <LoadingContent loading={calendarLoading} />
        ) : (
          <DiaryCalendar diaries={allDiaries} onDateClick={handleDateClick} />
        )}
      </div>

      <section className="px-4 pb-7">
        <div className="flex items-center gap-1 mb-3">
          <div className="text-md font-bold">
            {room?.nickname} 님의 일기 모아보기 🔍
          </div>
        </div>

        {loading && <LoadingContent loading={loading} />}
        {error && (
          <div className="text-sm text-red-400">일기를 불러오지 못했어요.</div>
        )}

        {diaries.map((diary) => (
          <div key={diary.id}>
            <ReviewItem review={diary} type="mine" />
          </div>
        ))}

        {hasMore && (
          <div className="pt-4 text-center">
            <button
              onClick={loadMore}
              disabled={loading}
              className="px-4 py-2 text-sm rounded-md border border-main-100 text-main-100 disabled:opacity-50"
            >
              {loading ? '불러오는 중...' : '더 불러오기'}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
