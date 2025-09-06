'use client';

import DiaryCard from './DiaryCard';
import ReviewItem from '@/app/festival/_components/ReviewItem';
import usePopularDiaries from '@/hooks/diary/usePopularDiaries';
import LoadingContent from '@/app/_components/LoadingContent';
import useFriendDiaries from '@/hooks/diary/useFriendDiaries';

export default function CollectTabSection() {
  const { populars, loading: popularLoading } = usePopularDiaries();
  const {
    diaries: friends,
    loading: friendsLoading,
    error,
  } = useFriendDiaries();

  return (
    <div className="space-y-10">
      <section className="px-4 mt-4">
        <div className="flex items-center gap-1 mb-3">
          <div className="text-md font-bold">이달의 인기글 ✨</div>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {popularLoading && <LoadingContent loading={popularLoading} />}
          {populars.map((it) => (
            <DiaryCard key={it.id} item={it} />
          ))}
        </div>
      </section>
      <section className="px-4 pb-24">
        <div className="flex items-center gap-1 mb-3">
          <div className="text-md font-bold">단짝 도리 일기 모아보기 🔍</div>
        </div>
        <div>
          {friendsLoading && <LoadingContent loading={friendsLoading} />}
          {error && (
            <div className="text-sm text-red-400">
              친구 일기를 불러오지 못했어요
            </div>
          )}
          {friends.map((diary) => (
            <ReviewItem key={diary.id} review={diary} />
          ))}
        </div>
      </section>
    </div>
  );
}
