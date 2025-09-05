'use client';

import { useState } from 'react';
import useDiaryLike from '@/hooks/diary/useDiaryLike';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';

export default function ReviewItem({ review, type = 'diary', onLikeSync }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const user = useAuthStore((state) => state.user);

  const isMine = review.authorId === user.userId;

  const {
    liked,
    loading: likeLoading,
    mutating: likeMutating,
    toggleLike,
  } = useDiaryLike(review.id);

  const [likeCount, setLikeCount] = useState(review.likes || 0);

  const text =
    expanded || review.content.length <= 70
      ? review.content
      : `${review.content.slice(0, 70)}...`;

  const displayedText = text.replace(/\n/g, '<br />');
  const formattedDate = review.date ? review.date.replace(/-/g, '.') : '';
  const displayLikeText = likeCount === 0 ? '좋아요' : likeCount;

  return (
    <div className="overflow-hidden py-3 space-y-3">
      <div className="flex items-center justify-between">
        {type === 'mine' ? (
          <div className="text-sm font-semibold text-neutral-800 flex items-center gap-1 truncate">
            <i className="mgc_sparkles_fill text-sub-100 text-lg" />
            {review.festivalName}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <img
              src={review.profileImage || '/images/profileImage_default.svg'}
              alt="profile"
              className="w-8 h-8 rounded-full oobject-cover"
            />
            <div className="text-sm font-semibold text-neutral-800">
              {review.authorName}
            </div>
            {isMine && (
              <div className="text-[10px] bg-sub2-5 text-sub2-100 rounded-sm px-1 py-0.5 flex items-center justify-center">
                내 리뷰
              </div>
            )}
          </div>
        )}

        {type === 'mine' ? (
          <button
            className="text-[11px] px-3 py-0.5 bg-main-5 text-main-100 rounded"
            onClick={() => router.push(`/festival/${review.festivalId}`)}
          >
            축제 보기
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button className="text-[11px] px-3 py-0.5 bg-main-5 text-main-100 rounded">
              방문
            </button>
          </div>
        )}
      </div>

      {review.images.length > 0 && (
        <div className="flex overflow-x-scroll gap-2 scrollbar-hide mb-3">
          {review.images.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`review-${idx}`}
              className="w-[110px] h-[110px] object-cover rounded-lg"
            />
          ))}
        </div>
      )}

      {type === 'diary' && (
        <div className="mb-2">
          <span className="bg-sub2-5 text-sub2-100 rounded-sm px-1.5 py-1 text-[11px]">
            {review.festivalName}
          </span>
        </div>
      )}

      <div className="text-sm text-neutral-700">
        <p
          dangerouslySetInnerHTML={{
            __html: displayedText,
          }}
        />
        {review.content.length > 70 && (
          <button
            className="mt-1 text-xs text-neutral-400"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? '간략히' : '더보기'}
          </button>
        )}
      </div>
      <div className="flex items-center mt-2 gap-2">
        <div className="text-xs text-neutral-400">{formattedDate} 방문 •</div>
        <div className="flex items-center gap-1 text-main-100 text-xs">
          <button
            onClick={async () => {
              const nextLiked = !liked;
              await toggleLike();
              setLikeCount((prev) =>
                nextLiked ? prev + 1 : Math.max(0, prev - 1)
              );
              onLikeSync?.(review.id, nextLiked); // 부모에도 반영
            }}
            disabled={likeLoading || likeMutating}
            aria-disabled={likeLoading || likeMutating}
            aria-pressed={liked}
          >
            {liked ? (
              <i className="mgc_emoji_2_fill text-lg text-main-100" />
            ) : (
              <i className="mgc_emoji_2_line text-lg text-neutral-400" />
            )}
          </button>
          <span
            className={`text-[11px] ${
              liked ? 'text-main-100' : 'text-neutral-400'
            }`}
          >
            {displayLikeText}
          </span>
        </div>
      </div>
    </div>
  );
}
