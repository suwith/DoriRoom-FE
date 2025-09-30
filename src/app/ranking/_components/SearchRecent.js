'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import 'mingcute_icon/font/Mingcute.css';
import SearchInputBar from '@/app/festival/_components/SearchInputBar';
import { recentSearches, recentVisits } from '../dummyData';

export default function UserSearchPage() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    // 로컬스토리지에서 최근 검색어 가져오기
    const stored = localStorage.getItem('userRecentSearches');
    if (stored) {
      setRecent(JSON.parse(stored));
    } else {
      setRecent(recentSearches); // 더미데이터 기본값
    }
  }, []);

  const removeTag = (tag) => {
    setRecent((prev) => {
      const updated = prev.filter((t) => t !== tag);
      localStorage.setItem('userRecentSearches', JSON.stringify(updated));
      return updated;
    });
  };

  const goToResult = (keyword) => {
    const encoded = encodeURIComponent(keyword);
    const path = `/ranking/search/result?query=${encoded}`;
    router.push(path);
  };

  return (
    <div className="appbar-padding-t w-screen h-screen bg-background mx-auto">
      {/* 검색창 */}
      <div className="px-4">
        <SearchInputBar
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onEnter={(text) => goToResult(text)}
          onClear={() => setInput('')}
          withBack
          autoFocus
        />
      </div>

      {/* 최근 검색어 */}
      <div className="mt-6 px-4">
        <h3 className="text-sm mb-3 font-semibold">최근 검색어</h3>
        <div className="flex gap-2 flex-wrap">
          {recent.map((tag) => (
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
          ))}
        </div>
      </div>

      {/* 최근 방문한 프로필 */}
      <div className="mt-6 px-4">
        <h3 className="text-sm mb-3 font-semibold">최근 방문한 프로필</h3>
        <div className="flex gap-4">
          {recentVisits.map((user) => (
            <div key={user.nickname} className="flex flex-col items-center">
              <img
                src={user.profileImage}
                alt={user.nickname}
                className="w-12 h-12 rounded-full border border-neutral-200 object-cover"
              />
              <span className="text-xs mt-1">{user.nickname}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
