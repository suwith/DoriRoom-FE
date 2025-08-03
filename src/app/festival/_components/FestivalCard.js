'use client';

import { useState } from 'react';
import { GoHeart, GoHeartFill } from 'react-icons/go';

export default function FestivalCard({ festival }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(festival.likes || 0);

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <div className="bg-background overflow-hidden">
      <div
        className="relative bg-neutral-100 w-full h-40 bg-cover bg-center rounded-lg"
        style={{ backgroundImage: `url(${festival.thumbnail})` }}
      >
        <div className="absolute top-3 right-3 flex flex-col items-center gap-0.5">
          <button onClick={handleLike}>
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
          <span className="text-main-100 bg-main-5 px-1 rounded-xl">
            {festival.region}
          </span>
          <span className="text-main-100 bg-main-5 px-1 rounded-full">
            {festival.category}
          </span>
          <span className="text-main-100 bg-main-5 px-1 rounded-full">
            후기 {festival.reviews.length}개
          </span>
          <span className="text-main-100 bg-main-5 px-1 rounded-full">
            {festival.price === 0 ? '무료' : '유료'}
          </span>
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
