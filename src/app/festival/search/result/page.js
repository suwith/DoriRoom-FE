'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchInputBar from '@/app/festival/_components/SearchInputBar';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import FestivalListItem from '@/app/festival/_components/FestivalListItem';
import SortFilter from '@/app/festival/search/_components/SortFilter';
import RegionFilter from '@/app/festival/search/_components/RegionFilter';
import CategoryFilter from '@/app/festival/search/_components/CategoryFilter';
import DateFilter from '@/app/festival/search/_components/DateFilter';
import { useSearchFestivals } from '@/hooks/festival/useSearchFestivals';

export default function FestivalSearchResultPage() {
  const router = useRouter();
  const [mode, setMode] = useState('default');

  // 검색 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [input, setInput] = useState('');

  // 좋아요 상태
  const [likedIds, setLikedIds] = useState([]);

  // 필터 상태
  const [sort, setSort] = useState('');
  const [regions, setRegions] = useState([]); // [{ areaGroupCode, areaCode, sigunguCode }]
  const [categories, setCategories] = useState([]);
  const [period, setPeriod] = useState({ start: null, end: null });

  // 필터 시트 열림 상태
  const [sheet, setSheet] = useState(null);

  // URL 파라미터 → 상태 초기화
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'select') setMode('select');

    const q = params.get('query') || '';
    setSearchQuery(q);
    setInput(q);

    setSort(params.get('sort') || '');

    // regions: JSON 직렬화된 객체 배열
    const r = params.get('regions');
    if (r) {
      try {
        setRegions(JSON.parse(r));
      } catch {
        setRegions([]);
      }
    }

    const c = (params.get('categories') || '').split(',').filter(Boolean);
    setCategories(c);

    const start = params.get('start');
    const end = params.get('end');
    setPeriod({
      start: start ? new Date(start) : null,
      end: end ? new Date(end) : null,
    });
  }, []);

  useEffect(() => {
    document.body.style.overflow = sheet ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sheet]);

  const handleEnter = (text) => {
    setSearchQuery(text);
    const query = new URLSearchParams();
    if (text) query.set('query', text);
    if (sort) query.set('sort', sort);
    if (regions.length) query.set('regions', JSON.stringify(regions));
    if (categories.length) query.set('categories', categories.join(','));
    if (period.start) query.set('start', period.start.toISOString());
    if (period.end) query.set('end', period.end.toISOString());
    router.replace(`/festival/search/result?${query.toString()}`);
  };

  const toggleLike = (id) => {
    setLikedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // regionOptions: RegionFilter에서 쓰이는 옵션
  const [regionOptions, setRegionOptions] = useState([]);
  useEffect(() => {
    fetch('/regions.json')
      .then((r) => r.json())
      .then((grouped) => {
        const list = [];
        for (const g of grouped) {
          const groupName = g.areaGroupName;
          const areaGroupCode = g.areaGroupCode;
          const areaCode = g.areaCode;
          const areaName = g.areaName;
          const content = Array.isArray(g.content) ? g.content : [];
          for (const it of content) {
            list.push({
              groupName,
              areaGroupCode,
              areaCode,
              areaName,
              sigunguCode: it.code,
              sigunguName: it.name,
            });
          }
        }
        setRegionOptions(list);
      })
      .catch(() => setRegionOptions([]));
  }, []);

  const categoryOptions = [
    '문화관광축제',
    '문화예술축제',
    '지역특산물축제',
    '전통역사축제',
    '생태자연축제',
    '기타축제',
    '공연',
    '행사',
  ];

  // 라벨
  const regionLabel = regions.length
    ? (() => {
        const first = regions[0];
        const area = regionOptions.find(
          (o) =>
            o.areaGroupCode === first.areaGroupCode &&
            o.areaCode === first.areaCode &&
            o.sigunguCode === first.sigunguCode
        );
        if (!area) return '지역';
        if (first.sigunguCode === null) return `${area.areaName} 전체`;
        return `${area.areaName} ${area.sigunguName}`;
      })() + (regions.length > 1 ? ` 외 ${regions.length - 1}` : '')
    : '지역';

  const categoryLabel = categories.length
    ? `${categories[0]}${categories.length > 1 ? ` 외 ${categories.length - 1}` : ''}`
    : '분야';

  const fmt = (d) =>
    d ? `${String(d.getMonth() + 1)}/${String(d.getDate())}` : '';
  const sortLabel = sort || '정렬';

  // chip 버튼 스타일
  const chip = (active) =>
    `px-2 py-0.5 rounded-full border text-xs inline-flex items-center gap-1 whitespace-nowrap shrink-0 ${
      active
        ? 'bg-main-5 border-main-100 text-main-100'
        : 'border-neutral-200 text-neutral-900'
    }`;

  const { items, loading, error, hasMore, loadMore } = useSearchFestivals({
    keyword: searchQuery,
    regions, // 객체 배열
    categories,
    period,
    sort,
    size: 20,
  });

  // 무한스크롤 옵저버
  const sentinelRef = useRef(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: '200px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore]);

  return (
    <div className="max-w-[390px] mx-auto h-screen w-screen flex flex-col bg-background">
      {/* 고정 헤더 */}
      <header className="sticky top-0 z-[10] bg-background">
        <div className="pt-[50px] px-4 pb-3">
          <SearchInputBar
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onEnter={handleEnter}
            onClear={() => setInput('')}
            withBack
          />

          {mode !== 'select' && (
            <div className="flex items-center gap-2 overflow-x-auto flex-nowrap scrollbar-hide mt-3">
              <button
                className={chip(!!sort)}
                onClick={() => setSheet(sheet === 'sort' ? null : 'sort')}
              >
                <span className="mt-0.5 ml-0.5">{sortLabel}</span>
                {sheet === 'sort' ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </button>
              <button
                className={chip(!!regions.length)}
                onClick={() => setSheet(sheet === 'region' ? null : 'region')}
              >
                <span className="mt-0.5 ml-0.5">{regionLabel}</span>
                {sheet === 'region' ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </button>
              <button
                className={chip(!!categories.length)}
                onClick={() =>
                  setSheet(sheet === 'category' ? null : 'category')
                }
              >
                <span className="mt-0.5 ml-0.5">{categoryLabel}</span>
                {sheet === 'category' ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </button>
              <button
                className={chip(!!period.start)}
                onClick={() => setSheet(sheet === 'date' ? null : 'date')}
              >
                <span className="mt-0.5 ml-0.5">
                  {period.start
                    ? period.end
                      ? `${fmt(period.start)}~${fmt(period.end)}`
                      : `${fmt(period.start)}`
                    : '기간'}
                </span>
                {sheet === 'date' ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 스크롤 영역 */}
      <main className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        <div className="text-xs text-neutral-600 mb-3">
          검색결과 ({items.length})
        </div>
        <div className="space-y-4">
          {items.length === 0 && !loading ? (
            <div className="flex flex-col flex-1 items-center justify-center gap-3 min-h-[calc(100vh-200px)]">
              <i className="mgc_sweats_fill text-6xl text-main-100" />
              <p className="text-center text-lg font-semibold">
                앗, 관련 축제가 없어요!
              </p>
              <p className="text-center text-sm text-neutral-500">
                다른 키워드로 다시 검색해 주세요
              </p>
              <button
                onClick={() => router.push('/festival')}
                className="mt-4 px-6 py-2 rounded-md bg-main-5 text-main-100 text-xl font-medium "
              >
                축제 메인으로 돌아가기
              </button>
            </div>
          ) : (
            items.map((festival) => (
              <div
                key={festival.id}
                onClick={() =>
                  mode === 'select'
                    ? null
                    : router.push(`/festival/${festival.id}`)
                }
              >
                <FestivalListItem
                  festival={festival}
                  liked={likedIds.includes(festival.id)}
                  onLike={() => toggleLike(festival.id)}
                  mode={mode}
                  onSelect={() => {
                    sessionStorage.setItem(
                      'selectedFestival',
                      JSON.stringify(festival)
                    );
                    router.push('/diary/write');
                  }}
                />
              </div>
            ))
          )}
          {loading && (
            <div className="py-4 text-center text-neutral-500 text-sm">
              로딩중...
            </div>
          )}
          <div ref={sentinelRef} />
          {error && (
            <div className="py-3 text-center text-red-500 text-xs">
              오류가 발생했습니다.
            </div>
          )}
        </div>
      </main>

      {/* 오버레이 & 시트 */}
      {sheet && (
        <button
          className="fixed inset-0 bg-black/25 z-[99]"
          onClick={() => setSheet(null)}
          aria-label="필터 닫기"
        />
      )}
      <div
        className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] z-[100]
        bg-background rounded-t-xl px-4 py-8 transition-transform duration-300 ease-in-out
        ${sheet ? 'translate-y-0' : 'translate-y-[100vh]'}`}
      >
        <SortFilter
          open={sheet === 'sort'}
          onClose={() => setSheet(null)}
          value={sort}
          onChange={setSort}
        />
        <RegionFilter
          open={sheet === 'region'}
          onClose={() => setSheet(null)}
          value={regions}
          onChange={setRegions}
          options={regionOptions}
        />
        <CategoryFilter
          open={sheet === 'category'}
          onClose={() => setSheet(null)}
          value={categories}
          onChange={setCategories}
          options={categoryOptions}
        />
        <DateFilter
          open={sheet === 'date'}
          onClose={() => setSheet(null)}
          value={period}
          onChange={setPeriod}
        />
      </div>
    </div>
  );
}
