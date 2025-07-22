'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RegionFilter from '../RegionFilter';
import 'mingcute_icon/font/Mingcute.css';

export default function SearchPage({ onClose }) {
  const router = useRouter();
  const [input, setInput] = useState('');

  const recentSearches = ['바다', '산', '맥주', '파티'];
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

  return (
    <div className="max-w-[390px] w-full h-screen bg-white mx-auto px-4 pt-4">
      <div className="flex items-center gap-1">
        <i
          className="mgc_left_line text-3xl text-neutral-500 cursor-pointer"
          onClick={onClose}
        />
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

      <div className="mt-6">
        <h3 className="text-xs text-gray-500 mb-2">최근 검색어</h3>
        <div className="flex gap-2 flex-wrap">
          {recentSearches.map((tag) => (
            <div
              key={tag}
              className="bg-neutral-100 text-sm px-3 py-1 rounded-full text-gray-600"
            >
              {tag} ✕
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xs text-gray-500 mb-2">카테고리</h3>
        <RegionFilter />
      </div>

      <div className="mt-6 mb-20">
        <h3 className="text-xs text-gray-500 mb-2">실시간 검색어</h3>
        <ul className="text-sm text-gray-800 space-y-1">
          {trending.map((item, idx) => (
            <li key={item.keyword} className="flex justify-between">
              <span>
                {idx + 1}. {item.keyword}
              </span>
              <span className="text-xs">
                {item.status === 'up' && (
                  <span className="text-red-400">▲</span>
                )}
                {item.status === 'down' && (
                  <span className="text-blue-400">▼</span>
                )}
                {item.status === 'same' && (
                  <span className="text-gray-300">-</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
