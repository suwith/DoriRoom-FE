'use client';

import BottomSheet from './BottomSheet';
import { useState } from 'react';

export default function CategoryFilter({
  open,
  onClose,
  value = [],
  onChange,
  options,
}) {
  const [temp, setTemp] = useState(value);
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
        <div className="flex gap-2 font-semibold pb-3">
          <button
            className="flex-1 py-3 rounded-md bg-main-15 text-main-100"
            onClick={() => setTemp([])}
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
            총 {temp.length}개 결과 보기
          </button>
        </div>
      }
    >
      <div className="flex flex-wrap gap-2">
        {options.map((c) => {
          const active = temp.includes(c);
          return (
            <button
              key={c}
              onClick={() => toggle(c)}
              className={`px-3 py-1 rounded-full border text-sm ${active ? 'bg-main-5 border-main-100 text-main-100' : 'border-neutral-200'}`}
            >
              {c}
            </button>
          );
        })}
      </div>
    </BottomSheet>
  );
}
