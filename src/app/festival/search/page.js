'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RegionFilter from '../_components/RegionFilter';
import 'mingcute_icon/font/Mingcute.css';
import BackButton from '@/app/_components/BackButton';

export default function SearchPage() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [recentSearches, setRecentSearches] = useState([
    '바다',
    '산',
    '맥주',
    '파티',
  ]);

  const trending = [
    { keyword: '바다', status: 'up' },
    { keyword: '수영', status: 'up' },
    { keyword: '해수욕장', status: 'same' },
    { keyword: '속초', status: 'same' },
    { keyword: '강릉', status: 'same' },
    { keyword: '캠핑', status: 'same' },
    { keyword: '야외', status: 'same' },
    { keyword: '피크닉', status: 'down' },
  ];

  const handleSearch = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      router.push(`/festival/search/result?query=${encodeURIComponent(input)}`);
    }
  };

  const removeTag = (tag) => {
    setRecentSearches((prev) => prev.filter((t) => t !== tag));
  };

  return (
    <div className="max-w-[390px] w-full h-screen bg-white mx-auto pt-4">
      {/* 검색창 */}
      <div className="flex items-center gap-1 px-4">
        <BackButton />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleSearch}
          placeholder="방문하고 싶은 축제를 검색해 보세요!"
          className="flex-1 bg-neutral-100 px-4 py-1.5 rounded-lg text-sm outline-none"
          autoFocus
        />
      </div>

      {/* 최근 검색어 */}
      <div className="mt-6 px-4">
        <h3 className="text-sm mb-3 font-semibold">최근 검색어</h3>
        <div className="flex gap-2 flex-wrap">
          {recentSearches.map((tag) => (
            <div
              key={tag}
              className="bg-transparent text-xs px-2 py-1 rounded-full border border-neutral-200  text-neutral-900 flex items-center gap-1"
            >
              <span>{tag}</span>
              <button
                onClick={() => removeTag(tag)}
                className="text-[10px] text-neutral-300"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 w-full h-1 p-0 bg-neutral-100"></div>

      {/* 카테고리 */}
      <div className="mt-6 px-4">
        <h3 className="text-sm mb-3 font-semibold">카테고리</h3>
        <RegionFilter />
      </div>

      {/* 실시간 검색어 */}
      <div className="mt-10 mb-20 px-4">
        <h3 className="text-sm mb-3 font-semibold">실시간 검색어</h3>
        <div className="flex gap-6 pl-3">
          {/* 왼쪽 컬럼 */}
          <div className="flex-1 space-y-2 text-sm text-gray-800">
            {trending.slice(0, 4).map((item, idx) => (
              <div
                key={item.keyword}
                className="flex items-center justify-between pr-4 p-0.5"
              >
                <span>
                  <span className="mr-5 text-neutral-500 text-xs">
                    {idx + 1}
                  </span>
                  <span className="text-[13px]">{item.keyword}</span>
                </span>
                <span className="text-xs gap-1 flex items-center">
                  {item.status === 'up' && (
                    <i className="mgc_up_small_fill text-red-500 text-2xl" />
                  )}
                  {item.status === 'down' && (
                    <i className="mgc_down_small_fill text-blue-500 text-2xl" />
                  )}
                  {item.status === 'same' && (
                    <span className="text-neutral-400 px-2.5 py-1">–</span>
                  )}
                </span>
              </div>
            ))}
          </div>

          {/* 오른쪽 컬럼 */}
          <div className="flex-1 space-y-2 text-sm text-gray-800">
            {trending.slice(4).map((item, idx) => (
              <div
                key={item.keyword}
                className="flex items-center justify-between pr-4 p-0.5"
              >
                <span>
                  <span className="mr-5 text-neutral-500 text-xs">
                    {idx + 5}
                  </span>
                  <span className="text-[13px]">{item.keyword}</span>
                </span>
                <span className="text-xs gap-1 flex items-center">
                  {item.status === 'up' && (
                    <i className="mgc_up_small_fill text-red-500 text-2xl" />
                  )}
                  {item.status === 'down' && (
                    <i className="mgc_down_small_fill text-blue-500 text-2xl" />
                  )}
                  {item.status === 'same' && (
                    <span className="text-neutral-400 px-2.5 py-1">–</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
