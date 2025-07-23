'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockFestivals } from '../../mockData';
import SearchInputBar from '@/app/festival/_components/SearchInputBar';
import { FiFilter } from 'react-icons/fi';
import { IoIosArrowDown } from 'react-icons/io';
import FestivalListItem from '@/app/festival/_components/FestivalListItem';

export default function FestivalSearchResultPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [input, setInput] = useState('');
  const [likedIds, setLikedIds] = useState([]);

  // ✅ 클라이언트에서 쿼리 직접 파싱
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('query') || '';
    setSearchQuery(query);
    setInput(query);
  }, []);

  const handleEnter = (text) => {
    setSearchQuery(text);
    router.replace(`/festival/search/result?query=${encodeURIComponent(text)}`);
  };

  const toggleLike = (id) => {
    setLikedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const filteredFestivals = mockFestivals.filter((f) =>
    f.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-[390px] w-full h-screen mx-auto px-4 pt-4 pb-28">
      <SearchInputBar
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onEnter={handleEnter}
        onClear={() => router.push('/festival/search')}
        withBack
      />

      <div className="flex gap-2 items-center mt-3 mb-3">
        {['정렬기준', '지역', '분야', '기간'].map((tag) => (
          <button
            key={tag}
            className="bg-transparent text-xs px-2 py-1 rounded-full border border-neutral-200  text-neutral-900 flex items-center gap-1"
          >
            <span>{tag}</span>
            <IoIosArrowDown />
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
