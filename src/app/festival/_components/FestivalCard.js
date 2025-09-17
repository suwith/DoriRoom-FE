'use client';

import { GoHeart, GoHeartFill } from 'react-icons/go';
import useFestivalFavorite from '@/hooks/festival/useFestivalFavorite';

export default function FestivalCard({ festival }) {
  const { liked, likeCount, loading, toggleFavorite } = useFestivalFavorite(
    festival.eventId,
    festival.likes
  );

  const onLikeClick = (e) => {
    e.stopPropagation();
    toggleFavorite();
  };

  return (
    <div className="bg-background overflow-hidden">
      <div
        className="relative bg-neutral-100 w-full h-44 bg-cover bg-center rounded-lg"
        style={{
          backgroundImage: `url(${
            festival.thumbnail || '/images/festivalImage_default.svg'
          })`,
        }}
      >
        <div className="absolute top-3 right-3 flex flex-col items-center gap-0.5">
          <button onClick={onLikeClick} disabled={loading}>
            {liked ? (
              <GoHeartFill className="text-main-100 w-5 h-5 drop-shadow" />
            ) : (
              <GoHeart className="text-background w-5 h-5 drop-shadow" />
            )}
          </button>
          <span
            className={`text-[10px] drop-shadow ${liked ? 'text-main-100' : 'text-background'}`}
          >
            {likeCount}
          </span>
        </div>
      </div>

      <div className="py-2 text-[10px]">
        <div className="flex flex-wrap gap-1 mt-0.5">
          <span className="text-main-100 bg-main-5 px-1 py-[1px] rounded-sm">
            {festival.region.slice(0, 2)}
          </span>
          <span className="text-main-100 bg-main-5 px-1 py-[1px] rounded-sm">
            {festival.category}
          </span>
          {festival.reviews > 0 && (
            <span className="text-main-100 bg-main-5 px-1 py-[1px] rounded-sm">
              일기 {festival.reviews}개
            </span>
          )}

          {festival.price === '무료' && (
            <span className="text-main-100 bg-main-5 px-1 py-[1px] rounded-sm">
              무료
            </span>
          )}
        </div>
        <div className="font-bold text-sm mt-1.5 truncate">
          {festival.title}
        </div>
        <div className="text-neutral-600 mt-0.5 text-xs truncate">
          {festival.location}
        </div>
        <div className="text-neutral-400 mt-1 text-[11px] font-thin">
          {festival.startDate}~{festival.endDate}
        </div>
      </div>
    </div>
  );
}
