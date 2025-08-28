'use client';

import BottomSheet from './BottomSheet';
import { useEffect, useMemo, useState } from 'react';

export default function RegionFilter({
  open,
  onClose,
  value = [],
  onChange,
  options = [],
}) {
  const [temp, setTemp] = useState(value);
  const [selectedSido, setSelectedSido] = useState('');

  const bySido = useMemo(() => {
    const map = {};
    options.forEach(({ sido, sigungu }) => {
      if (!map[sido]) map[sido] = new Set();
      map[sido].add(sigungu);
    });

    return Object.fromEntries(
      Object.entries(map).map(([k, v]) => [k, Array.from(v)])
    );
  }, [options]);

  const sidoList = useMemo(() => Object.keys(bySido), [bySido]);

  useEffect(() => {
    if (open) {
      setTemp(value);
      setSelectedSido((prev) => prev || sidoList[0] || '');
    }
  }, [open, value, sidoList]);

  // 최대 선택 10개 상수로 정의해도 되고, prop으로 받아도 됨
  const MAX = 10;

  const toggle = (sido, sigungu) => {
    const key = `${sido}/${sigungu}`;
    setTemp((prev) => {
      const exists = prev.includes(key);
      if (exists) {
        return prev.filter((x) => x !== key);
      }

      // '전체' 선택 시: 같은 시/도 선택 전부 제거 후 '전체'만 추가
      if (sigungu === '전체') {
        const cleared = prev.filter((x) => !x.startsWith(`${sido}/`));
        if (cleared.length + 1 > MAX) {
          alert(`선택은 최대 ${MAX}개까지 가능합니다.`);
          return prev;
        }
        return [...cleared, key];
      }

      // 같은 시/도에 '전체'가 이미 선택되어 있으면 교체 처리
      const hadSidoAll = prev.includes(`${sido}/전체`);
      if (hadSidoAll) {
        const replaced = prev.filter((x) => x !== `${sido}/전체`);
        // 교체이므로 길이 증가 없음 → 제한 체크 불필요
        return [...replaced, key];
      }

      // 일반 추가: 현재 길이 검사
      if (prev.length >= MAX) {
        alert(`선택은 최대 ${MAX}개까지 가능합니다.`);
        return prev;
      }

      return [...prev, key];
    });
  };

  const removeChip = (key) => {
    setTemp((prev) => prev.filter((x) => x !== key));
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="지역"
      footer={
        <div className="flex items-center gap-2 pb-3">
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
            총 {temp.length}개 결과 보기
          </button>
        </div>
      }
    >
      {/* 상단 탭 바 */}
      <div className="grid grid-cols-2">
        <div className="text-center py-2 font-semibold text-neutral-600 border-b border-neutral-300">
          시/도
        </div>
        <div className="text-center py-2 text-neutral-600 border-b border-neutral-300">
          시/구/군
        </div>
      </div>

      <div className="grid grid-cols-2 min-h-[340px]">
        {/* 좌측: 시/도 리스트 */}
        <div className="overflow-hidden">
          <ul className="max-h-[340px] overflow-y-auto scrollbar-hide">
            {sidoList.map((sido) => {
              const active = selectedSido === sido;
              return (
                <li key={sido}>
                  <button
                    type="button"
                    onClick={() => setSelectedSido(sido)}
                    className={[
                      'w-full px-4 h-10 text-sm text-center',
                      active
                        ? 'bg-main-5 text-main-100 border-main-10'
                        : 'bg-neutral-100 text-neutral-500 ',
                    ].join(' ')}
                  >
                    {sido}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* 우측: 시/구/군 멀티선택 리스트 */}
        <div className="flex flex-col">
          {/* 섹션 헤더 */}

          <div className="max-h-[340px] overflow-y-auto scrollbar-hide">
            <ul>
              {/* 전체 옵션 */}
              {selectedSido && (
                <li>
                  {(() => {
                    const k = `${selectedSido}/전체`;
                    const active = temp.includes(k);
                    return (
                      <button
                        type="button"
                        onClick={() => toggle(selectedSido, '전체')}
                        className="w-full px-4 h-10 flex items-center justify-between"
                      >
                        <span
                          className={`text-sm ${active ? 'text-main-100' : 'text-neutral-300'}`}
                        >
                          전체
                        </span>
                        <span className="ml-3 inline-flex items-center justify-center">
                          <i
                            className={`mgc_check_fill text-lg mb-1 ${active ? 'text-main-100' : 'text-neutral-300'}`}
                          />
                        </span>
                      </button>
                    );
                  })()}
                </li>
              )}

              {(bySido[selectedSido] || []).map((g) => {
                const k = `${selectedSido}/${g}`;
                const active = temp.includes(k);
                const atMax = temp.length >= MAX;
                const sidoAllSelected = temp.includes(`${selectedSido}/전체`);
                const disabled = !active && atMax && !sidoAllSelected;

                return (
                  <li key={k}>
                    <button
                      type="button"
                      onClick={() => {
                        if (disabled) {
                          alert(`선택은 최대 ${MAX}개까지 가능합니다.`);
                          return;
                        }
                        toggle(selectedSido, g);
                      }}
                      className={[
                        'w-full px-4 h-10 flex items-center justify-between border-b last:border-b-0',
                        disabled ? 'opacity-50' : '',
                      ].join(' ')}
                    >
                      <span
                        className={`text-sm ${active ? 'text-main-100' : 'text-neutral-300'}`}
                      >
                        {g}
                      </span>
                      <span className="ml-3 inline-flex items-center justify-center">
                        <i
                          className={`mgc_check_fill text-lg mb-1 ${active ? 'text-main-100' : 'text-neutral-300'}`}
                        />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      {/* 선택 칩 영역 */}
      <div className="mt-3">
        <div className="text-xs text-neutral-400 mb-2 text-right">
          <span className="text-main-100">{temp.length}</span>/{MAX}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {temp.map((k) => {
            const [s, g] = k.split('/');
            return (
              <span
                key={k}
                className="inline-flex items-center gap-1 px-2 h-6 text-[13px] rounded-sm bg-main-5 text-main-100 whitespace-nowrap"
              >
                {g === '전체' ? `${s} 전체` : `${s} ${g}`}
                <button
                  type="button"
                  className="ml-1 inline-flex items-center justify-center h-3 w-3"
                  onClick={() => removeChip(k)}
                >
                  <i className="mgc_close_fill text-sm text-main-40 flex justify-center items-center" />
                </button>
              </span>
            );
          })}
        </div>
      </div>
    </BottomSheet>
  );
}
