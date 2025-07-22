'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { GoHeart, GoHeartFill } from 'react-icons/go';
import { FaCommentAlt } from 'react-icons/fa';
import { FiFilter } from 'react-icons/fi';
import { mockFestivals } from '../../mockData';
import 'mingcute_icon/font/Mingcute.css';
import BackButton from '@/app/_components/BackButton';

export default function FestivalSearchResultPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const [likedIds, setLikedIds] = useState([]);

  const toggleLike = (id) => {
    setLikedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // 추후 실제 검색 필터링 로직에 맞게 필터링 가능
  const filteredFestivals = mockFestivals.filter((f) =>
    f.title.includes(query)
  );

  return (
    <div className="max-w-[390px] w-full h-screen mx-auto px-4 pt-4 pb-28">
      <div className="flex items-center gap-2 mb-2">
        <BackButton />

        <div className="flex-1 bg-neutral-100 px-4 py-2 rounded-lg text-sm text-gray-500">
          {query}
        </div>
      </div>

      <div className="flex gap-2 items-center mb-3">
        {['정렬기준', '지역', '분야', '기간'].map((tag) => (
          <button
            key={tag}
            className="px-3 py-1 rounded-full bg-neutral-100 text-xs text-gray-600"
          >
            {tag}
          </button>
        ))}
        <button className="ml-auto p-1">
          <FiFilter className="text-neutral-500 w-4 h-4" />
        </button>
      </div>

      <div className="text-xs text-neutral-600 mb-3">
        검색결과 ({filteredFestivals.length})
      </div>

      <div className="space-y-4">
        {filteredFestivals.map((festival) => (
          <FestivalListItem
            key={festival.id}
            festival={festival}
            liked={likedIds.includes(festival.id)}
            onLike={() => toggleLike(festival.id)}
          />
        ))}
      </div>
    </div>
  );
}

function FestivalListItem({ festival, liked, onLike }) {
  return (
    <div className="bg-white">
      <div className="flex gap-3">
        {/* 썸네일 + 좋아요 버튼 */}
        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={festival.thumbnail}
            alt={festival.title}
            className="w-full h-full object-cover"
          />
          <button onClick={onLike} className="absolute top-1 left-1 z-10">
            {liked ? (
              <GoHeartFill className="text-main-100 w-4 h-4 drop-shadow" />
            ) : (
              <GoHeart className="text-white w-4 h-4 drop-shadow" />
            )}
          </button>
        </div>

        {/* 본문 + 하단 좋아요/리뷰 수치를 수직 분리 */}
        <div className="flex flex-col justify-between flex-1 pr-1">
          {/* 상단 텍스트 정보 */}
          <div>
            <div className="flex flex-wrap gap-1 mb-1 text-[11px]">
              <span className="text-main-100 bg-main-5 px-1 rounded-xl">
                {festival.region}
              </span>
              <span className="text-main-100 bg-main-5 px-1 rounded-full">
                {festival.category}
              </span>
              <span className="text-main-100 bg-main-5 px-1 rounded-full">
                후기 {festival.reviews}개
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
          </div>

          {/* 하단 날짜 + 좋아요/리뷰 */}
          <div className="flex justify-between items-end mt-2">
            <div className="text-neutral-400 text-[11px] font-thin">
              {festival.startDate} ~ {festival.endDate}
            </div>
            <div className="flex gap-3 text-[11px]">
              <div className="flex items-center gap-1 text-main-100">
                <GoHeartFill className="w-3.5 h-3.5" />
                <span>{festival.likes}</span>
              </div>
              <div className="flex items-center gap-1 text-main-100">
                <FaCommentAlt className="w-3.5 h-3.5" />
                <span>{festival.reviews}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
