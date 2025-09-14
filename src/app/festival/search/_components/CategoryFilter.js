'use client';

import BottomSheet from './BottomSheet';
import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { useFestivalFilterStore } from '@/stores/useFestivalFilterStore';
import {
  CATEGORY_NAME_TO_CODE,
  dedupLocations,
  formatDateYYYYMMDD,
  toApiLocation,
} from '@/lib/festivalConstants';

export default function CategoryFilter({
  open,
  onClose,
  value = [],
  onChange,
  options = [],
}) {
  const [temp, setTemp] = useState(value);
  const [filteredCount, setFilteredCount] = useState(0);

  const { keyword, regions, period, sort } = useFestivalFilterStore();

  useEffect(() => {
    if (open) setTemp(value);
  }, [open, value]);

  // count 조회
  useEffect(() => {
    if (!open) return;

    async function fetchCount() {
      try {
        const categoryCodes = (temp || [])
          .map((n) => CATEGORY_NAME_TO_CODE[n])
          .filter(Boolean);

        // 1) UI 중복 제거
        const uiLocations = dedupLocations(regions);
        // 2) API 전송용으로 변환
        const locations = uiLocations.map(toApiLocation);

        const res = await axiosInstance.post(
          '/event/filtered',
          {
            locations,
            categoryCodes: categoryCodes.length ? categoryCodes : undefined,
            startDate: period?.start
              ? formatDateYYYYMMDD(period.start)
              : undefined,
            endDate: period?.end
              ? formatDateYYYYMMDD(period.end)
              : formatDateYYYYMMDD(period.start),
            keyword: keyword || undefined,
          },
          { params: { page: 0, size: 0 } }
        );

        setFilteredCount(res?.data?.content?.totalElements ?? 0);
      } catch {
        setFilteredCount(0);
      }
    }

    fetchCount();
  }, [temp, keyword, regions, period, sort, open]);

  const toggle = (k) => {
    setTemp((prev) =>
      prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]
    );
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="분야"
      footer={
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-4 py-3 rounded-md bg-main-15 text-main-100 font-semibold shrink-0"
            onClick={() => setTemp([])}
          >
            초기화
          </button>

          <button
            type="button"
            className="flex-1 py-3 rounded-md bg-main-100 text-white font-semibold"
            onClick={() => {
              onChange(temp);
              onClose();
            }}
          >
            총 {filteredCount}개 결과 보기
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-2 mb-6">
        {options.map((c) => {
          const active = temp.includes(c);
          return (
            <button
              type="button"
              key={c}
              onClick={() => toggle(c)}
              className={[
                'h-12 w-full rounded-lg px-4',
                'flex items-center justify-between text-[15px]',
                active
                  ? 'bg-main-5 text-main-100'
                  : 'bg-neutral-100 text-neutral-800',
              ].join(' ')}
            >
              <span className="truncate">{c}</span>
              <span className="ml-3 inline-flex items-center justify-center">
                <i
                  className={`mgc_check_fill text-xl ${
                    active ? 'text-main-100' : 'text-neutral-300'
                  }`}
                />
              </span>
            </button>
          );
        })}
      </div>
    </BottomSheet>
  );
}
