'use client';

import { mockFestivals } from '@/app/festival/mockData';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DiaryListItem({ diary }) {
  const router = useRouter();
  const festival = mockFestivals.find((f) => f.id === diary.festivalId);

  const [showDiaryMenu, setShowDiaryMenu] = useState(false);

  return (
    <div
      className="bg-main-5 rounded-lg p-3 space-y-2"
      onClick={() => router.push(`/diary/${diary.id}`)}
    >
      <div className="flex items-center justify-between">
        {/* 축제명 */}
        <div className="inline-block text-[13px] font-bold text-main-100 bg-background px-2 py-0.5 rounded-md">
          {festival.title}
        </div>
        <div>
          <i
            className="mgc_more_2_line text-neutral-300 text-md"
            onClick={() => setShowDiaryMenu((prev) => !prev)}
          />
          {showDiaryMenu && (
            <div className="absolute right-6 mt-0 w-24 bg-background border border-neutral-100 text-neutral-600 rounded shadow-md text-sm z-50">
              <button
                className="w-full text-center px-4 py-2 hover:bg-neutral-100"
                onClick={() => {
                  setShowDiaryMenu(false);
                  console.log('수정 완료');
                }}
              >
                수정
              </button>
              <hr className="text-neutral-100" />
              <button
                className="w-full text-center px-4 py-2 hover:bg-neutral-100"
                onClick={() => {
                  setShowDiaryMenu(false);
                  console.log('삭제 완료');
                }}
              >
                삭제
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 일기 내용 */}
      <div className="text-xs text-neutral-700 leading-snug">
        {diary.content.length > 120
          ? `${diary.content.slice(0, 120)}...`
          : diary.content}
      </div>

      {/* 이미지 썸네일 */}
      {diary.images?.length > 0 && (
        <div className="flex overflow-x-auto gap-2 scrollbar-hide">
          {diary.images.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`diary-${idx}`}
              className="w-[110px] h-[110px] object-cover rounded-lg flex-shrink-0"
            />
          ))}
        </div>
      )}

      {/* 날짜 + 좋아요 개수 */}
      <div className="flex items-center justify-between text-[11px] text-neutral-400">
        <div className="flex items-center gap-1 text-main-100">
          <i className="mgc_emoji_2_fill text-md text-main-100" />
          <span className="pt-1">{diary.likes ?? 0}</span>
        </div>
        <div>{diary.date}</div>
      </div>
    </div>
  );
}
