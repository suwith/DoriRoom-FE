'use client';

import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import { useState } from 'react';
import { mockFestivals } from '@/app/festival/mockData';
import FestivalListItem from '@/app/festival/_components/FestivalListItem';
import Icon from '@mdi/react';
import { mdiTree } from '@mdi/js';

export default function DiaryDetail({ diary }) {
  const [likedIds, setLikedIds] = useState([]);
  const [isBottomOpen, setIsBottomOpen] = useState(true); // 기본값 true 또는 false 설정

  const isLiked = likedIds.includes(diary.id);
  const likeCount = diary.likes + (isLiked ? 1 : 0);
  const displayLikeText = likeCount === 0 ? '좋아요' : likeCount;

  const handleLike = (id) => {
    setLikedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const festival = mockFestivals.find((f) => f.id === diary.festivalId);

  return (
    <div className="pt-20 pb-28">
      <HeaderNavigationBar
        title={festival.title}
        type="diary"
        onEditClick={() => console.log('수정 클릭')}
        onDeleteClick={() => console.log('삭제 클릭')}
        className="bg-background"
      />

      <div className="p-5 space-y-5 whitespace-pre-line">
        <div className="text-sm">{diary.content}</div>
        <div className="flex overflow-x-scroll gap-2 scrollbar-hide">
          {diary.images?.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`diary-${idx}`}
              className="w-[140px] h-[140px] object-cover rounded-lg"
            />
          ))}
        </div>
      </div>

      <div className="flex items-center px-5 pb-5 mt-2 gap-2">
        <div className="text-xs text-neutral-400">{diary.date} •</div>
        <div className="flex items-center gap-1 text-xs">
          <button onClick={() => handleLike(diary.id)}>
            <i
              className={`mgc_emoji_2_line text-lg ${
                isLiked ? 'text-main-100' : 'text-neutral-400'
              }`}
            />
          </button>
          <span className={isLiked ? 'text-main-100' : 'text-neutral-400'}>
            {displayLikeText}
          </span>
        </div>
      </div>

      {/* 관련 축제 바텀시트 */}
      {festival && isBottomOpen && (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[390px] mx-auto pb-16 z-100 rounded-t-xl px-4 pt-4 bg-main-5 shadow-[0_-4px_12px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out ">
          <div className="w-20 h-1 bg-main-40 rounded-full mx-auto mb-2" />
          <div className="text-sm font-bold text-main-100 flex items-center gap-1 mb-3">
            <Icon path={mdiTree} className="w-4 h-4 text-main-100" />
            관련 축제
          </div>
          <div
            className="bg-white rounded-xl py-1"
            style={{
              boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <FestivalListItem festival={festival} hideLikeButton={true} />
          </div>
        </div>
      )}
    </div>
  );
}
