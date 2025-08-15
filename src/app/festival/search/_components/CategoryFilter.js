'use client';

import BottomSheet from './BottomSheet';
import { useEffect, useState } from 'react';

export default function CategoryFilter({
  open,
  onClose,
  value = [],
  onChange,
  options = [],
}) {
  const [temp, setTemp] = useState(value);

  // 바텀시트 열릴 때마다 현재 값으로 리셋
  useEffect(() => {
    if (open) setTemp(value);
  }, [open, value]);

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
                  ? 'bg-main-5 0 text-main-100'
                  : 'bg-neutral-100  text-neutral-800',
              ].join(' ')}
            >
              <span className="truncate">{c}</span>

              {/* 우측 체크 인디케이터 */}
              <span className="ml-3 inline-flex items-center justify-center">
                <i
                  className={`mgc_check_fill  text-xl ${active ? 'text-main-100' : 'text-neutral-300'}`}
                />
              </span>
            </button>
          );
        })}
      </div>
    </BottomSheet>
  );
}
