'use client';

import { GoHeart, GoHeartFill } from 'react-icons/go';
import { FaCommentAlt } from 'react-icons/fa';

export default function FestivalListItem({
  festival,
  liked = false,
  onLike = null,
  hideLikeButton = false,
}) {
  return (
    <div className={` flex gap-3 ${hideLikeButton ? 'px-4 py-2' : ''}  `}>
      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={festival.thumbnail}
          alt={festival.title}
          className="w-full h-full object-cover"
        />
        {!hideLikeButton && (
          <button onClick={onLike} className="absolute top-1 left-1 z-10">
            {liked ? (
              <GoHeartFill className="text-main-100 w-4 h-4 drop-shadow" />
            ) : (
              <GoHeart className="text-white w-4 h-4 drop-shadow" />
            )}
          </button>
        )}
      </div>

      <div className="flex flex-col justify-between flex-1 pr-1">
        <div>
          <div className="flex flex-wrap gap-1 mb-1 text-[11px]">
            <span className="text-main-100 bg-main-5 px-1 rounded-full">
              {festival.region}
            </span>
            <span className="text-main-100 bg-main-5 px-1 rounded-full">
              {festival.category}
            </span>
            {festival.reviews.length > 0 && (
              <span className="text-main-100 bg-main-5 px-1 rounded-full">
                후기 {festival.reviews.length}개
              </span>
            )}
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
        </div>

        <div className="flex justify-between items-end mt-2">
          <div className="text-neutral-400 text-[11px] font-thin">
            {festival.startDate}~{festival.endDate}
          </div>
          <div className="flex gap-3 text-[11px]">
            <div className="flex items-center gap-1 text-main-100">
              <GoHeartFill className="w-3.5 h-3.5" />
              <span>{festival.likes}</span>
            </div>
            <div className="flex items-center gap-1 text-main-100">
              <FaCommentAlt className="w-3.5 h-3.5" />
              <span>{festival.reviews.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
