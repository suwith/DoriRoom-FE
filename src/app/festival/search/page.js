'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RegionFilter from '../_components/RegionFilter';
import 'mingcute_icon/font/Mingcute.css';
import SearchInputBar from '@/app/festival/_components/SearchInputBar';
import useSearchPopulars from '@/hooks/festival/useSearchPopulars';

export default function SearchPage() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const { trending, loading, error } = useSearchPopulars();

  useEffect(() => {
    const mode = sessionStorage.getItem('selectMode');

    if (mode === 'true') {
      setIsSelectMode(true);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  const saveRecentSearch = (keyword) => {
    setRecentSearches((prev) => {
      const updated = [keyword, ...prev.filter((t) => t !== keyword)].slice(
        0,
        8
      );
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  };

  const removeTag = (tag) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((t) => t !== tag);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  };

  const goToResult = (keyword) => {
    const encoded = encodeURIComponent(keyword);
    const base = `/festival/search/result?query=${encoded}`;
    const path = isSelectMode ? `${base}&mode=select` : base;
    saveRecentSearch(keyword);
    router.push(path);
  };

  return (
    <div className="max-w-[390px] w-full h-screen bg-background mx-auto pt-[50px]">
      {/* 검색창 */}
      <div className="px-4">
        <SearchInputBar
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onEnter={(text) => {
            const encoded = encodeURIComponent(text);
            const base = `/festival/search/result?query=${encoded}`;
            const path = isSelectMode ? `${base}&mode=select` : base;

            router.push(path);
            saveRecentSearch(text);
          }}
          onClear={() => setInput('')}
          withBack
          autoFocus
        />
      </div>

      {/* 최근 검색어 */}
      <div className="mt-6 px-4">
        <h3 className="text-sm mb-3 font-semibold">최근 검색어</h3>
        <div className="flex gap-2 flex-wrap">
          {recentSearches.map((tag) => {
            return (
              <button
                key={tag}
                onClick={() => goToResult(tag)}
                className="bg-transparent text-xs px-2 py-1 rounded-full border border-neutral-200 text-neutral-900 flex items-center justify-center gap-1"
              >
                <span className="pt-0.5">{tag}</span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(tag);
                  }}
                  className="text-[10px] text-neutral-300 cursor-pointer"
                >
                  <i className="mgc_close_line flex justify-center items-center text-xs" />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 w-full h-2 p-0 bg-neutral-100"></div>

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
              <button
                key={item.keyword}
                onClick={() => goToResult(item.keyword)}
                className="w-full flex items-center justify-between pr-4 p-0.5"
              >
                <span className="flex items-center">
                  <span className="mr-5 text-neutral-500 text-xs">
                    {idx + 1}
                  </span>
                  <span className="text-[13px]">{item.keyword}</span>
                </span>
                <span className="text-xs gap-1 flex items-center">
                  {item.status === 'up' && (
                    <i className="mgc_up_small_fill text-main-100 text-2xl" />
                  )}
                  {item.status === 'down' && (
                    <i className="mgc_down_small_fill text-sub-100 text-2xl" />
                  )}
                  {item.status === 'same' && (
                    <span className="text-neutral-400 px-2.5 py-1">–</span>
                  )}
                </span>
              </button>
            ))}
          </div>

          {/* 오른쪽 컬럼 */}
          <div className="flex-1 space-y-2 text-sm text-gray-800">
            {trending.slice(4).map((item, idx) => (
              <button
                key={item.keyword}
                onClick={() => goToResult(item.keyword)}
                className="w-full flex items-center justify-between pr-4 p-0.5"
              >
                <span className="flex items-center">
                  <span className="mr-5 text-neutral-500 text-xs">
                    {idx + 5}
                  </span>
                  <span className="text-[13px]">{item.keyword}</span>
                </span>
                <span className="text-xs gap-1 flex items-center">
                  {item.status === 'up' && (
                    <i className="mgc_up_small_fill text-main-100 text-2xl" />
                  )}
                  {item.status === 'down' && (
                    <i className="mgc_down_small_fill text-sub-100 text-2xl" />
                  )}
                  {item.status === 'same' && (
                    <span className="text-neutral-400 px-2.5 py-1">–</span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
