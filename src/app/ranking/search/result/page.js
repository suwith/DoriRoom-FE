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

  const [query, setQuery] = useState(initialQuery);
  const [tab, setTab] = useState('전체'); // "전체" | "이웃도리"

  const { results: allResults } = useSearchAll(query);
  const { results: followResults } = useSearchFollow(query);

  const goToResult = (keyword) => {
    const encoded = encodeURIComponent(keyword);
    router.replace(`/ranking/search/result?query=${encoded}`);
    setQuery(keyword);
  };

  const results = tab === '전체' ? allResults : followResults;

  return (
    <div className="appbar-padding-t w-screen h-screen bg-background mx-auto">
      {/* 검색창 */}
      <div className="px-4">
        <SearchInputBar
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onEnter={(text) => goToResult(text)}
          onClear={() => setQuery('')}
          withBack
        />
      </div>

      {/* 탭 */}
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

      {/* 검색 결과 */}
      <div className="px-4 mt-4 pb-4">
        <SearchResult query={query} results={results} />
      </div>
    </div>
  );
}
