// app/diary/_components/DiaryCard.jsx
'use client';

import { useState } from 'react';

export default function DiaryCard({ item, onClick }) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <button
      className="w-[150px] shrink-0 text-left"
      onClick={() => onClick?.(item.id)}
    >
      <div className="relative w-[150px] h-[150px] rounded-lg overflow-hidden bg-neutral-100">
        <img
          src={item.images[0] || '/images/festivalImage_default.svg'}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-1 flex flex-col items-center px-2 py-0.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked((prev) => !prev);
            }}
            className="cursor-pointer h-6"
          >
            {isLiked ? (
              <i className="mgc_emoji_2_fill text-xl text-main-100 drop-shadow" />
            ) : (
              <i className="mgc_emoji_2_line text-xl text-background drop-shadow" />
            )}
          </button>
          <span
            className={`text-[10px] ${isLiked ? 'text-main-100' : 'text-background drop-shadow'}`}
          >
            {item.likes}
          </span>
        </div>
      </div>

      <div className="mt-3 space-y-1">
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
          <div className="text-[11px] text-neutral-600">{item.date}</div>
        </div>
      </div>
    </button>
  );
}
