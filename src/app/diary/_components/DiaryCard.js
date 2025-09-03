'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axiosInstance';

export default function DiaryCard({ item }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likes || 0);
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/diary/${item.id}`);
  };

  const toggleLike = async (e) => {
    e.stopPropagation();
    try {
      await axiosInstance.post(`/api/diary/${item.id}/like`);
      setIsLiked((prev) => !prev);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  // date 포맷 변환: 2025-08-10 → 2025.08.10
  const formattedDate = item.date ? item.date.replace(/-/g, '.') : '';

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
          <button onClick={toggleLike} className="cursor-pointer h-6">
            {isLiked ? (
              <i className="mgc_emoji_2_fill text-xl text-main-100 drop-shadow" />
            ) : (
              <i className="mgc_emoji_2_line text-xl text-background drop-shadow" />
            )}
          </button>
          <span
            className={`text-[10px] ${isLiked ? 'text-main-100' : 'text-background drop-shadow'}`}
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
