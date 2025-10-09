'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useDiaryLike from '@/hooks/diary/useDiaryLike';
import { useToast } from '@/app/_providers/ToastProvider';

export default function DiaryCard({ item }) {
  const router = useRouter();
  const { show } = useToast();

  const {
    liked,
    loading: likeLoading,
    mutating: likeMutating,
    toggleLike,
  } = useDiaryLike(item.id);

  const [likeCount, setLikeCount] = useState(item.likes || 0);

  // 카드 클릭 → 상세 이동
  const handleCardClick = () => {
    router.push(`/diary/${item.id}`);
  };

  // date 포맷 변환: 2025-08-10 → 2025.08.10
  const formattedDate = item.date ? item.date.replace(/-/g, '.') : '';

  // 좋아요 버튼 클릭
  const handleLikeClick = async (e) => {
    e.stopPropagation();
    const nextLiked = !liked;

    try {
      const result = await toggleLike();

      if (result?.ok) {
        setLikeCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));
      } else {
        show({
          message: result?.message || '좋아요 처리 중 오류가 발생했어요.',
          variant: 'error',
        });
      }
    } catch (e) {
      show({
        message: e.message || '좋아요 처리 중 오류가 발생했어요.',
        variant: 'error',
      });
    }
  };

  return (
    <div
      className="w-[150px] shrink-0 text-left cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative w-[150px] h-[150px] rounded-lg overflow-hidden bg-neutral-100">
        <img
          src={item.images[0] || '/images/diaryImage_default.svg'}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-1 flex flex-col items-center px-2 py-0.5">
          <button
            onClick={handleLikeClick}
            disabled={likeLoading || likeMutating}
            aria-disabled={likeLoading || likeMutating}
            aria-pressed={liked}
            className="cursor-pointer h-6"
          >
            {liked ? (
              <i className="mgc_emoji_2_fill text-xl text-main-100 drop-shadow" />
            ) : (
              <i className="mgc_emoji_2_line text-xl text-background drop-shadow" />
            )}
          </button>
          <span
            className={`text-[10px] ${
              liked ? 'text-main-100' : 'text-background drop-shadow'
            }`}
          >
            {likeCount}
          </span>
        </div>
      </div>

      <div className="mt-3 space-y-1 pl-1 pr-2">
        <div className="flex items-center gap-2 mb-2">
          <img
            src={item.profileImage || '/images/profileImage_default.svg'}
            alt="profile"
            className="w-5 h-5 rounded-full"
          />
          <div className="text-[12px] text-neutral-800 truncate">
            {item.authorName}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="text-[13px] font-semibold text-neutral-900 truncate">
            {item.festivalName}
          </div>
          <div className="text-[11px] text-neutral-600">{formattedDate}</div>
        </div>
      </div>
    </div>
  );
}
