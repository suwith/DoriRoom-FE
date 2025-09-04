'use client';

import { useRouter } from 'next/navigation';
import DiaryCalendar from './DiaryCalendar';
import ReviewItem from '@/app/festival/_components/ReviewItem';
import LoadingContent from '@/app/_components/LoadingContent';
import useUserDiaries from '@/hooks/diary/useUserDiaries';
import { useAuthStore } from '@/stores/useAuthStore';

export default function MyDiaryTabSection() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  // 캘린더용 → 전체 일기 조회
  const { diaries: allDiaries, loading: calendarLoading } = useUserDiaries({
    userId: user?.userId,
    paging: false,
  });

  // 목록용 → 페이지네이션
  const { diaries, loading, error, hasMore, loadMore } = useUserDiaries({
    userId: user?.userId,
    pageSize: 10,
    paging: true,
  });

  const handleDateClick = (isoDate) => {
    const formatted = isoDate.replace(/-/g, '.');
    const diariesForDate = allDiaries.filter((d) => d.date === isoDate);

    if (diariesForDate.length === 1) {
      router.push(`/diary/${diariesForDate[0].id}`);
    } else if (diariesForDate.length > 1) {
      router.push(`/diary/date/${formatted}`);
    }
  };

  return (
    <>
      <div className="px-10 mt-3">
        {calendarLoading ? (
          <LoadingContent loading={calendarLoading} />
        ) : (
          <DiaryCalendar diaries={allDiaries} onDateClick={handleDateClick} />
        )}
      </div>

      <section className="px-4 pb-24">
        <div className="flex items-center gap-1 mb-3">
          <div className="text-md font-bold">내 일기 모아보기 🔍</div>
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
    </>
  );
}
