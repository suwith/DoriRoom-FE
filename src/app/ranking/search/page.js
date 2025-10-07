'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import 'mingcute_icon/font/Mingcute.css';
import SearchInputBar from '@/app/festival/_components/SearchInputBar';
import useRecentVisits from '@/hooks/ranking/useRecentVisits';

export default function UserSearchPage() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const { visits } = useRecentVisits();

  useEffect(() => {
    const stored = localStorage.getItem('userRecentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  const removeTag = (tag) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((t) => t !== tag);
      localStorage.setItem('userRecentSearches', JSON.stringify(updated));
      return updated;
    });
  };

  const goToResult = (keyword) => {
    if (!keyword.trim()) return;
    const encoded = encodeURIComponent(keyword);
    router.push(`/ranking/search/result?query=${encoded}`);

    setRecentSearches((prev) => {
      // 중복 제거 후 맨 앞 추가, 최대 10개 제한
      const updated = [keyword, ...prev.filter((t) => t !== keyword)].slice(
        0,
        10
      );
      localStorage.setItem('userRecentSearches', JSON.stringify(updated));
      return updated;
    });
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
          type={'ranking'}
        />
      </div>

      {/* 최근 검색어 */}
      <div className="mt-6 px-4">
        <h3 className="text-sm mb-3 font-semibold">최근 검색어</h3>
        <div className="flex gap-2 flex-wrap">
          {recentSearches.map((tag) => (
            <button
              key={tag}
              onClick={(e) => {
                e.stopPropagation();
                goToResult(tag);
              }}
              className="bg-transparent text-xs px-2 py-1 rounded-full border border-neutral-200 text-neutral-900 flex items-center gap-1"
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
      <div className="mt-6 w-full h-2 bg-neutral-100"></div>

      {/* 최근 방문한 프로필 */}
      <div className="mt-6 ml-4">
        <h3 className="text-sm mb-3 font-semibold">최근 방문한 프로필</h3>
        <div className="flex overflow-x-auto flex-nowrap scrollbar-hide">
          {visits.map((user) => (
            <div
              key={user.userId}
              className="flex flex-col items-center cursor-pointer shrink-0 mr-4 w-16"
              onClick={() => router.push(`/neighbor/${user.userId}`)}
            >
              <img
                src={user.profileImageUrl || '/images/profileImage_default.svg'}
                alt={user.nickname}
                className="w-16 h-16 rounded-full border border-neutral-200 object-cover"
              />
              <div className="text-xs mt-1 text-center break-words leading-tight">
                {user.nickname}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
