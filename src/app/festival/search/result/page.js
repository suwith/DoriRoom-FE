'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockFestivals } from '../../mockData';
import SearchInputBar from '@/app/festival/_components/SearchInputBar';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import FestivalListItem from '@/app/festival/_components/FestivalListItem';
import SortFilter from '@/app/festival/search/_components/SortFilter';
import RegionFilter from '@/app/festival/search/_components/RegionFilter';
import CategoryFilter from '@/app/festival/search/_components/CategoryFilter';
import DateFilter from '@/app/festival/search/_components/DateFilter';

export default function FestivalSearchResultPage() {
  const router = useRouter();
  const [mode, setMode] = useState('default');

  //검색 맟 압력
  const [searchQuery, setSearchQuery] = useState('');
  const [input, setInput] = useState('');

  // 좋아요 상태
  const [likedIds, setLikedIds] = useState([]);

  // 필터 상태
  const [sort, setSort] = useState('');
  const [regions, setRegions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [period, setPeriod] = useState({ start: null, end: null });

  // 필터 시트 열림 상태
  const [sheet, setSheet] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get('mode');
    if (modeParam === 'select') setMode('select');

    const q = params.get('query') || '';
    setSearchQuery(q);
    setInput(q);

    const s = params.get('sort') || '';
    setSort(s);

    const r = (params.get('regions') || '').split(',').filter(Boolean);
    setRegions(r);

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
    if (sheet) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sheet]);

  const handleEnter = (text) => {
    setSearchQuery(text);
    router.replace(`/festival/search/result?query=${encodeURIComponent(text)}`);
  };

  const toggleLike = (id) => {
    setLikedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // 정렬
  const sorter = (a, b) => {
    if (sort === '최신순') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sort === '좋아요순') return (b.likes ?? 0) - (a.likes ?? 0);
    return (b.score ?? 0) - (a.score ?? 0); // 추천순
  };
  // 목록 필터링
  const filteredFestivals = useMemo(() => {
    const text = (searchQuery || '').toLowerCase();
    let res = mockFestivals.filter((f) => f.title.toLowerCase().includes(text));

    if (regions.length) {
      res = res.filter((f) =>
        regions.includes(`${f.regionSido}/${f.regionSigungu}`)
      );
    }
    if (categories.length) {
      res = res.filter((f) => categories.includes(f.category));
    }
    if (period.start || period.end) {
      res = res.filter((f) => {
        const s = new Date(f.startDate);
        const e = new Date(f.endDate);
        const okStart = period.start ? e >= period.start : true;
        const okEnd = period.end ? s <= period.end : true;
        return okStart && okEnd;
      });
    }
    return res.sort(sorter);
  }, [searchQuery, regions, categories, period, sort]);

  // 옵션 예시
  const regionOptions = [
    { sido: '서울', sigungu: '강남구' },
    { sido: '서울', sigungu: '광진구' },
    { sido: '서울', sigungu: '강북구' },
    { sido: '부산', sigungu: '해운대구' },
  ];
  const categoryOptions = [
    '관광축제',
    '예술축제',
    '전통축제',
    '자연축제',
    '공연',
    '행사',
  ];

  // 라벨/요약
  const firstSigungu = (v) => (v[0] ? v[0].split('/')[1] || v[0] : '');
  const countLabel = (v) => (v.length > 1 ? ` 외 ${v.length - 1}` : '');
  const regionLabel = regions.length
    ? `${firstSigungu(regions)}${countLabel(regions)}`
    : '지역';
  const categoryLabel = categories.length
    ? `${categories[0]}${countLabel(categories)}`
    : '분야';
  const fmt = (d) =>
    d ? `${String(d.getMonth() + 1)}/${String(d.getDate())}` : '';
  const sortLabel = sort || '정렬';

  // 공통 버튼 스타일
  const chip = (active) =>
    `px-2 py-0.5 rounded-full border text-xs inline-flex items-center gap-1 whitespace-nowrap shrink-0 ${
      active
        ? 'bg-main-5 border-main-100 text-main-100'
        : 'border-neutral-200 text-neutral-900'
    }`;

  return (
    <div className="max-w-[390px] w-screen h-screen mx-auto px-4 pt-4 pb-28">
      <SearchInputBar
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onEnter={handleEnter}
        onClear={() => router.push('/festival/search')}
        withBack
      />

      {mode !== 'select' && (
        <div>
          {/* 상단 요약 필터 바: 선택값이 버튼 안을 채우게 */}
          <div className="flex items-center gap-2 overflow-x-auto flex-nowrap scrollbar-hide mt-3 mb-2">
            <button
              className={chip(sort !== '')}
              onClick={() => setSheet('sort')}
            >
              <span className="mt-0.5 ml-0.5">{sortLabel}</span>
              {sheet === 'sort' ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </button>
            <button
              className={chip(!!regions.length)}
              onClick={() => setSheet('region')}
            >
              <span className="mt-0.5 ml-0.5">{regionLabel}</span>
              {sheet === 'region' ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </button>
            <button
              className={chip(!!categories.length)}
              onClick={() => setSheet('category')}
            >
              <span className="mt-0.5 ml-0.5">{categoryLabel}</span>
              {sheet === 'category' ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </button>
            <button
              className={chip(!!period.start)}
              onClick={() => setSheet('date')}
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

          <div className="text-xs text-neutral-600 pt-4">
            검색결과 ({filteredFestivals.length})
          </div>
        </div>
      )}

      <div className="space-y-4 h-full mt-3">
        {filteredFestivals.length === 0 ? (
          <div
            className="flex flex-col h-full items-center justify-center gap-3"
            style={{ height: 'calc(100% - 80px)' }}
          >
            <i className="mgc_sweats_fill text-6xl text-main-100" />
            <p className="text-center text-lg font-semibold">
              앗, 관련 축제가 없어요!
            </p>
            <p className="text-center text-sm text-neutral-500">
              다른 키워드로 다시 검색해 주세요 😢
            </p>
            <button
              onClick={() => router.push('/festival')}
              className="mt-4 px-6 py-2 rounded-md bg-main-5 text-main-100 text-xl font-medium "
            >
              축제 메인으로 돌아가기
            </button>
          </div>
        ) : (
          filteredFestivals.map((festival) => (
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
      </div>

      {sheet && (
        <button
          className="fixed inset-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-black/25 z-99"
          onClick={() => setSheet(null)}
          aria-label="필터 닫기"
        />
      )}
      <div
        className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[390px] z-100 transition-transform duration-300 ease-in-out ${
          sheet ? 'translate-y-0' : 'translate-y-[100vh]'
        }`}
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
          // resultCount={filteredFestivals.length} // 쓰면 "총 N개 결과 보기" 표시 가능
        />
      </div>
    </div>
  );
}
