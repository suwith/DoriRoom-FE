'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchInputBar from '@/app/festival/_components/SearchInputBar';
import SearchResult from '../../_components/SearchResult';
import useSearchAll from '@/hooks/ranking/useSearchAll';
import useSearchFollow from '@/hooks/ranking/useSearchFollow';
import { IoIosArrowDown } from 'react-icons/io';
import { FaXmark } from 'react-icons/fa6';
import { IoCheckmarkSharp } from 'react-icons/io5';
import Tabs from '@/app/_components/Tabs';

const filterList = [
  { id: 0, name: '전체보기', type: 'ALL' },
  { id: 1, name: '팔로잉', type: 'FOLLOWING' },
  { id: 2, name: '팔로워', type: 'FOLLOWER' },
  { id: 3, name: '단짝도리', type: 'BEST_FRIEND' },
];

export default function SearchResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query') || '';
  const [selectFilter, setSelectFilter] = useState(filterList[0]);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);

  // input: 사용자가 타이핑 중인 값
  const [input, setInput] = useState(initialQuery);
  // query: 실제 검색 실행 시 갱신되는 값
  const [query, setQuery] = useState(initialQuery ? initialQuery : null);

  const [activeTab, setActiveTab] = useState(0);
  const tabList = ['전체도리', '이웃도리'];

  const { results: allResults } = useSearchAll(query || '');
  const { results: followResults } = useSearchFollow(
    query || '',
    selectFilter.type
  );

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
  const results = !query ? [] : activeTab === 0 ? allResults : followResults;

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
          type={'ranking'}
        />
      </div>

      {/* 탭: 검색 실행 후에만 노출 */}
      {query && (
        <Tabs
          tabs={tabList}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          type="festival"
        />
      )}

      {/* 검색 결과 */}
      {query && (
        <div className="px-4 mt-4 pb-4">
          {activeTab === 2 && (
            <div
              className="flex gap-2 items-center justify-end text-neutral-600 self-end font-normal text-[14px]"
              onClick={() => setBottomSheetOpen(true)}
            >
              <span>{selectFilter.name}</span>
              <IoIosArrowDown />
            </div>
          )}
          <SearchResult query={query} results={results} />
        </div>
      )}
      <div
        className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full mx-auto appbar-padding-b z-100 bg-background rounded-t-xl px-3 pt-4 shadow-[0_-4px_12px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out ${bottomSheetOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="flex items-center justify-between">
          <span className="font-semibold">정렬기준</span>
          <div className="bg-main-5 rounded-full p-1">
            <FaXmark
              size={13}
              className="font-bold text-main-100"
              onClick={() => {
                setBottomSheetOpen(false);
              }}
            />
          </div>
        </div>
        <div className="space-y-2 mt-5">
          {filterList.map((filter) => (
            <div
              key={filter.id}
              className={`flex items-center justify-between font-normal py-3 px-3 rounded-lg ${selectFilter.id === filter.id ? 'bg-main-5 text-main-100 font-semibold' : 'bg-neutral-100 text-neutral-900 font-normal'}`}
              onClick={() => {
                setSelectFilter(filter);
                setBottomSheetOpen(false);
              }}
            >
              {filter.name}
              {selectFilter.id === filter.id && <IoCheckmarkSharp />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
