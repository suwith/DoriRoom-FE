'use client';

import { useEffect, useMemo, useState } from 'react';
import BottomSheet from './BottomSheet';
import { useFestivalFilterStore } from '@/stores/useFestivalFilterStore';
import {
  CATEGORY_NAME_TO_CODE,
  dedupLocations,
  formatDateYYYYMMDD,
  toApiLocation,
} from '@/lib/festivalConstants';
import axiosInstance from '@/lib/axiosInstance';

// 월요일 시작 달력 그리드
function getMonthDaysMonStart(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const days = [];
  for (let i = 1; i <= last.getDate(); i++) days.push(new Date(year, month, i));
  const lead = (first.getDay() + 6) % 7; // Sun(0) -> 6, Mon(1) -> 0
  const padStart = Array(lead).fill(null);
  return [...padStart, ...days];
}

export default function DateFilter({
  open,
  onClose,
  value = { start: null, end: null },
  onChange,
}) {
  const now = new Date();
  const [ym, setYm] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [temp, setTemp] = useState(value);
  const [filteredCount, setFilteredCount] = useState(0);

  const { keyword, regions, categories, sort } = useFestivalFilterStore();

  useEffect(() => {
    if (!open) return;
    setTemp({
      start: value?.start ? new Date(value.start) : null,
      end: value?.end ? new Date(value.end) : null,
    });
    const base = value?.start ?? value?.end ?? now;
    setYm({ y: base.getFullYear(), m: base.getMonth() });
  }, [open, value]);

  // count 조회
  useEffect(() => {
    if (!open) return;

    async function fetchCount() {
      try {
        const categoryCodes = (categories || [])
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
            startDate: temp?.start ? formatDateYYYYMMDD(temp.start) : undefined,
            endDate: temp?.end ? formatDateYYYYMMDD(temp.end) : undefined,
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
  }, [temp, keyword, regions, categories, sort, open]);

  const grid = useMemo(() => getMonthDaysMonStart(ym.y, ym.m), [ym]);

  const sameDay = (a, b) =>
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  // 클릭 로직: 단일 선택 허용 + 같은 날짜 두 번 클릭 방지
  const pick = (day) => {
    if (!day) return;
    const start = temp?.start ? new Date(temp.start) : null;
    const end = temp?.end ? new Date(temp.end) : null;

    // 1) 아직 시작이 없거나(단일/새 선택 시작) 이미 범위가 끝난 상태면 -> start만 설정, end 비움
    if (!start || (start && end)) {
      setTemp({ start: day, end: null });
      return;
    }

    // 2) 시작만 있는 상태
    if (start && !end) {
      if (sameDay(day, start)) {
        // 같은 날짜 두 번 클릭: 아무것도 하지 않음 (end를 동일 날짜로 잡지 않음)
        return;
      }
      if (day < start) {
        // 더 이른 날짜를 누르면 start를 갱신(단일 선택 유지)
        setTemp({ start: day, end: null });
      } else {
        // 더 늦은 날짜면 범위 완료
        setTemp({ start, end: day });
      }
    }
  };

  const fmt = (d) => (d ? d.toISOString().slice(0, 10) : '');

  const inRange = (d) => {
    if (!d || !temp?.start || !temp?.end) return false;
    const s = new Date(temp.start);
    const e = new Date(temp.end);
    s.setHours(0, 0, 0, 0);
    e.setHours(0, 0, 0, 0);
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x >= s && x <= e;
  };

  const isStart = (d) => d && temp?.start && fmt(d) === fmt(temp.start);
  const isEnd = (d) => d && temp?.end && fmt(d) === fmt(temp.end);

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="기간"
      footer={
        <div className="flex gap-2 font-semibold">
          <button
            className="flex-1 py-3 rounded-md bg-main-15 text-main-100"
            onClick={() => setTemp({ start: null, end: null })}
          >
            초기화
          </button>
          <button
            className="flex-4 py-3 rounded-md bg-main-100 text-white"
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
      {/* 월 네비게이션 */}
      <div className="flex items-center justify-center mb-3">
        <button
          onClick={() =>
            setYm((p) => ({
              y: p.m === 0 ? p.y - 1 : p.y,
              m: p.m === 0 ? 11 : p.m - 1,
            }))
          }
          className="p-2 rounded-md"
          aria-label="이전 달"
        >
          <i className="mgc_left_small_fill text-2xl text-neutral-500" />
        </button>
        <div className="font-medium">
          {ym.y}년 {ym.m + 1}월
        </div>
        <button
          onClick={() =>
            setYm((p) => ({
              y: p.m === 11 ? p.y + 1 : p.y,
              m: p.m === 11 ? 0 : p.m + 1,
            }))
          }
          className="p-2 rounded-md"
          aria-label="다음 달"
        >
          <i className="mgc_right_small_fill text-2xl text-neutral-500" />
        </button>
      </div>

      {/* 요일 헤더: 월~일 */}
      <div className="grid grid-cols-7 gap-1 text-center text-sm mb-4 place-items-center">
        {['월', '화', '수', '목', '금', '토', '일'].map((d) => (
          <div key={d} className="w-10 text-neutral-500">
            {d}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-y-3 text-center text-sm place-items-stretch mb-6">
        {grid.map((d, idx) => {
          const selectedStart = isStart(d);
          const selectedEnd = isEnd(d);
          const inSelRange = inRange(d);

          const isColStart = idx % 7 === 0;
          const isColEnd = idx % 7 === 6;

          return (
            <div
              key={idx}
              className="relative h-10 w-full flex items-center justify-center"
            >
              {/* 중앙으로 이어지는 커넥터 (반쪽) */}
              {d && selectedStart && temp?.end && (
                <span
                  className="absolute inset-y-0 left-1/2 right-0 bg-main-15 -z-0"
                  style={{
                    borderTopRightRadius: isColEnd ? '9999px' : 0,
                    borderBottomRightRadius: isColEnd ? '9999px' : 0,
                  }}
                />
              )}
              {d && selectedEnd && temp?.start && (
                <span
                  className="absolute inset-y-0 left-0 right-1/2 bg-main-15 -z-0"
                  style={{
                    borderTopLeftRadius: isColStart ? '9999px' : 0,
                    borderBottomLeftRadius: isColStart ? '9999px' : 0,
                  }}
                />
              )}

              {/* 범위 중간(풀 폭 커넥터) */}
              {d && inSelRange && !selectedStart && !selectedEnd && (
                <span
                  className="absolute inset-0 bg-main-15 -z-0"
                  style={{
                    borderTopLeftRadius: isColStart ? '9999px' : 0,
                    borderBottomLeftRadius: isColStart ? '9999px' : 0,
                    borderTopRightRadius: isColEnd ? '9999px' : 0,
                    borderBottomRightRadius: isColEnd ? '9999px' : 0,
                  }}
                />
              )}

              {/* 날짜 버튼(동그라미는 시작/끝만) */}
              <button
                disabled={!d}
                onClick={() => d && pick(new Date(d))}
                className={[
                  'relative z-10 w-10 h-10 flex items-center justify-center pt-0.5',
                  !d ? 'opacity-0' : '',
                  selectedStart || selectedEnd
                    ? 'rounded-full bg-main-100 text-white'
                    : inSelRange
                      ? 'text-main-100' // 중간은 배경 span 위에 텍스트만
                      : 'rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200',
                ].join(' ')}
              >
                {d ? d.getDate() : ''}
              </button>
            </div>
          );
        })}
      </div>
    </BottomSheet>
  );
}
