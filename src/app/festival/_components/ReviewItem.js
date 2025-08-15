'use client';

import { useState } from 'react';

export default function ReviewItem({
  review,
  isLiked,
  onLike,
  type = 'festival',
}) {
  const [expanded, setExpanded] = useState(false);

  const displayedText =
    expanded || review.content.length <= 70
      ? review.content
      : `${review.content.slice(0, 70)}...`;

  const likeCount = review.likes + (isLiked ? 1 : 0);
  const displayLikeText = likeCount === 0 ? '좋아요' : likeCount;

  return (
    <div className="overflow-hidden">
      <div className="flex items-center justify-between mb-1 py-2">
        <div className="flex items-center gap-2">
          {review.profileImage ? (
            <img
              src={review.profileImage}
              alt="profile"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-neutral-100" />
          )}
          <div className="text-sm font-semibold text-neutral-800">
            {review.nickname}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-[11px] px-3 py-0.5 bg-main-5 text-main-100 rounded">
            방문
          </button>
          {type === 'diary' && (
            <button className="text-[11px] px-2 py-0.5 bg-main-5 text-main-100 rounded">
              팔로우
            </button>
          )}
        </div>
      </div>

      <div className="flex overflow-x-scroll gap-2 scrollbar-hide">
        {review.images?.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`review-${idx}`}
            className="w-[110px] h-[110px] object-cover rounded-lg"
          />
        ))}
      </div>

      <div className="py-2">
        <div className="text-sm text-neutral-700 mt-1">
          <p>{displayedText}</p>
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
          <div className="text-xs text-neutral-400 ">{review.date} •</div>
          <div className="flex items-center gap-1 text-main-100 text-xs">
            <button onClick={() => onLike(review.id)}>
              {isLiked ? (
                <i className="mgc_emoji_2_fill text-lg text-main-100" />
              ) : (
                <i className="mgc_emoji_2_line text-lg text-neutral-400" />
              )}
            </button>
            <span
              className={`text-[11px] ${
                isLiked ? 'text-main-100' : 'text-neutral-400'
              }`}
            >
              {displayLikeText}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
