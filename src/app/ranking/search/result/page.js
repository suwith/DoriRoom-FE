'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchInputBar from '@/app/festival/_components/SearchInputBar';
import SearchResult from '../../_components/SearchResult';
import useSearchAll from '@/hooks/ranking/useSearchAll';
import useSearchFollow from '@/hooks/ranking/useSearchFollow';

export default function SearchResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query') || '';

  // input: 사용자가 타이핑 중인 값
  const [input, setInput] = useState(initialQuery);
  // query: 실제 검색 실행 시 갱신되는 값
  const [query, setQuery] = useState(initialQuery ? initialQuery : null);
  const [tab, setTab] = useState('전체도리');

  const { results: allResults } = useSearchAll(query || '');
  const { results: followResults } = useSearchFollow(query || '');

  const goToResult = (keyword) => {
    if (!keyword.trim()) return;

    // 검색 실행 시 URL 변경
    const encoded = encodeURIComponent(keyword);
    router.replace(`/ranking/search/result?query=${encoded}`);

    // 상태 업데이트
    setQuery(keyword);
    setInput(keyword);

    // 최근 검색어 저장 (localStorage)
    try {
      const stored = localStorage.getItem('userRecentSearches');
      const prev = stored ? JSON.parse(stored) : [];
      // 중복 제거 후 맨 앞 추가, 최대 10개 제한
      const updated = [keyword, ...prev.filter((t) => t !== keyword)].slice(
        0,
        10
      );
      localStorage.setItem('userRecentSearches', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save recent search:', e);
    }
  };

  // query가 없을 땐 결과를 보여주지 않음
  const results = !query ? [] : tab === '전체도리' ? allResults : followResults;

  return (
    <div className="appbar-padding-t w-screen h-screen bg-background mx-auto">
      {/* 검색창 */}
      <div className="px-4">
        <SearchInputBar
          value={input}
          onChange={(e) => setInput(e.target.value)} // 입력만 변경
          onEnter={(text) => goToResult(text)} // 엔터 시 검색 실행
          onClear={() => setInput('')}
          withBack
          autoFocus
        />
      </div>

      {/* 탭: 검색 실행 후에만 노출 */}
      {query && (
        <div className="flex w-full border-b border-gray-200 mb-4 mt-4">
          {['전체도리', '이웃도리'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 pb-2 font-medium text-center relative ${
                tab === t ? 'text-main-100' : 'text-gray-400'
              }`}
            >
              {t}
              {tab === t && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-main-100 rounded-full"></span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* 검색 결과 */}
      {query && (
        <div className="px-4 mt-4 pb-4">
          <SearchResult query={query} results={results} />
        </div>
      )}
    </div>
  );
}
