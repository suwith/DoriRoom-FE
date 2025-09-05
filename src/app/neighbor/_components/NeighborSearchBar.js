'use client';

import React from 'react';

export default function NeighborSearchBar({ onSearch }) {
  return (
    <div className="mb-3 px-4">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="이웃의 닉네임을 검색해 보세요"
          onChange={(e) => onSearch(e.target.value)}
          className="w-full bg-neutral-100 px-9 py-2 rounded-lg text-sm outline-none text-neutral-900 placeholder:text-[13px] placeholder:text-neutral-500"
        />
        <i className="mgc_search_2_fill text-lg text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}
