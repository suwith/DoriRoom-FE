'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { mockFestivals } from '../../mockData';
import SearchInputBar from '@/app/festival/_components/SearchInputBar';
import { FiFilter } from 'react-icons/fi';
import { GoHeart, GoHeartFill } from 'react-icons/go';
import { FaCommentAlt } from 'react-icons/fa';

export default function FestivalSearchResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query') || '';

  const [input, setInput] = useState(initialQuery);
  const [likedIds, setLikedIds] = useState([]);

  const toggleLike = (id) => {
    setLikedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const handleEnter = (text) => {
    setSearchQuery(text);
    router.replace(`/festival/search/result?query=${encodeURIComponent(text)}`);
  };

  const filteredFestivals = mockFestivals.filter((f) =>
    f.title.includes(searchQuery)
  );

  return (
    <div className="max-w-[390px] w-full h-screen mx-auto px-4 pt-4 pb-28">
      {/* 상단 검색창 */}
      <SearchInputBar
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onEnter={handleEnter}
        onClear={() => router.push('/festival/search')}
        withBack
      />

      {/* 필터바 */}
      <div className="flex gap-2 items-center mt-3 mb-3">
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
