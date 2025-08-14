'use client';

import BottomSheet from './BottomSheet';
import { useMemo, useState } from 'react';

export default function RegionFilter({
  open,
  onClose,
  value = [],
  onChange,
  options,
}) {
  const [temp, setTemp] = useState(value);

  const bySido = useMemo(() => {
    const map = {};
    options.forEach(({ sido, sigungu }) => {
      if (!map[sido]) map[sido] = [];
      map[sido].push(sigungu);
    });
    return map;
  }, [options]);

  const toggle = (sido, sigungu) => {
    const key = `${sido}/${sigungu}`;
    setTemp((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]
    );
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="지역"
      footer={
        <div className="flex gap-2 font-semibold pb-3">
          <button
            className="flex-1 py-3 rounded-md  bg-main-15 text-main-100"
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
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          {Object.keys(bySido).map((s) => (
            <div key={s} className="px-3 py-2 rounded border">
              {s}
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {Object.entries(bySido).map(([s, gus]) => (
            <div key={s}>
              <div className="text-xs text-neutral-500 mb-2">{s}</div>
              <div className="flex flex-wrap gap-2">
                {gus.map((g) => {
                  const k = `${s}/${g}`;
                  const active = temp.includes(k);
                  return (
                    <button
                      key={k}
                      onClick={() => toggle(s, g)}
                      className={`px-3 py-1 rounded-full border text-sm ${active ? 'bg-main-5 border-main-100 text-main-100' : 'border-neutral-200'}`}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </BottomSheet>
  );
}
