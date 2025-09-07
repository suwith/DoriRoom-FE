'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import {
  CATEGORY_NAME_TO_CODE,
  dedupLocations,
  formatDateYYYYMMDD,
  toApiLocation,
} from '@/lib/festivalConstants';
import { useFestivalFilterStore } from '@/stores/useFestivalFilterStore';

// 정렬 매핑
const SORT_TO_PARAM = {
  추천순: 'RECOMMENDED',
  최신순: 'LATEST',
  좋아요순: 'POPULAR',
};

// 서버 응답 → 리스트 아이템 매핑
function mapItem(item) {
  return {
    id: item.eventId,
    eventId: item.eventId,
    contentId: item.contentId,
    title: item.title,
    location: item.addr1 ?? '',
    startDate: item.startDate,
    endDate: item.endDate,
    region: item.areaName,
    areaCode: item.areaCode,
    category: item.categoryName,
    likes: typeof item.favoriteCount === 'number' ? item.favoriteCount : 0,
    thumbnail: item.firstImage || item.secondImage || '',
    reviews: typeof item.diaryCount === 'number' ? item.diaryCount : 0,
    score: typeof item.score === 'number' ? item.score : 0,
    createdAt: item.createdAt ?? null,
  };
}

export function useSearchFestivals({
  keyword = '',
  regions = [], // [{ areaGroupCode, areaCode, sigunguCode }]
  categories = [], // ['문화관광축제', '공연', ...]
  period = { start: null, end: null },
  sort = '추천순',
  size = 20,
}) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  // 의존값이 바뀌면 리셋
  const depsKey = useMemo(() => {
    const c = (categories || []).join('|');
    const r = JSON.stringify(regions || []);
    const s = sort || '';
    const k = keyword || '';
    const start = period?.start ? formatDateYYYYMMDD(period.start) : '';
    const end = period?.end ? formatDateYYYYMMDD(period.end) : '';
    return `${k}__${r}__${c}__${start}__${end}__${s}`;
  }, [keyword, regions, categories, period?.start, period?.end, sort]);

  useEffect(() => {
    setItems([]);
    setPage(0);
    setHasMore(true);
    setError(null);
  }, [depsKey]);

  const inflight = useRef(false);

  const load = useCallback(async () => {
    if (loading || inflight.current || !hasMore) return;
    inflight.current = true;
    setLoading(true);
    setError(null);

    try {
      const { setKeyword, setRegions, setCategories, setPeriod, setSort } =
        useFestivalFilterStore.getState();

      setKeyword(keyword);
      setRegions(regions);
      setCategories(categories);
      setPeriod(period);
      setSort(sort);

      // 1) UI 중복 제거
      const uiLocations = dedupLocations(regions);
      // 2) API 전송용으로 변환
      const locations = uiLocations.map(toApiLocation);

      const categoryCodes = (categories || [])
        .map((n) => CATEGORY_NAME_TO_CODE[n])
        .filter(Boolean);

      const body = {
        locations,
        categoryCodes: categoryCodes.length ? categoryCodes : undefined,
        startDate: period?.start ? formatDateYYYYMMDD(period.start) : undefined,
        endDate: period?.end
          ? formatDateYYYYMMDD(period.end)
          : formatDateYYYYMMDD(period.start),
        keyword: keyword || undefined,
        sortType: SORT_TO_PARAM[sort] || 'RECOMMENDED',
      };

      const params = { page, size };

      const res = await axiosInstance.post('/event/filtered', body, { params });

      const pageData = res?.data?.content;
      const list = Array.isArray(pageData?.content) ? pageData.content : [];
      const mapped = list.map(mapItem);

      setItems((prev) => [...prev, ...mapped]);
      setHasMore(!pageData?.last && mapped.length > 0);
      setPage((p) => p + 1);
      setTotal(pageData?.totalElements ?? 0);

      // 최근검색어 저장
      if (keyword !== '') {
        const stored = JSON.parse(
          localStorage.getItem('recentSearches') || '[]'
        );
        const updated = [keyword, ...stored.filter((t) => t !== keyword)].slice(
          0,
          8
        );
        localStorage.setItem('recentSearches', JSON.stringify(updated));
      }
    } catch (e) {
      setError(e);
      setHasMore(false);
    } finally {
      setLoading(false);
      inflight.current = false;
    }
  }, [
    keyword,
    regions,
    categories,
    period?.start,
    period?.end,
    sort,
    size,
    page,
    hasMore,
    loading,
  ]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) load();
  }, [load, loading, hasMore]);

  const reset = useCallback(() => {
    setItems([]);
    setPage(0);
    setHasMore(true);
    setError(null);
  }, []);

  return { items, loading, error, hasMore, loadMore, reset, total };
}
