'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import BackButton from '../../_components/BackButton';
import 'mingcute_icon/font/Mingcute.css';

export default function SearchInputBar({
  value,
  onChange,
  onEnter,
  onClear,
  withBack = false,
  autoFocus = false,
}) {
  const router = useRouter();
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && value.trim()) {
      onEnter?.(value.trim());
    }
  };

  return (
    <div className="flex items-center justify-center gap-1 relative">
      {withBack && <BackButton />}
      <div className="relative flex-1">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder="방문하고 싶은 축제를 검색해 보세요!"
          className="w-full bg-neutral-100 px-9 py-2 rounded-lg text-sm outline-none text-neutral-900 placeholder:text-[13px] placeholder:text-neutral-500"
        />
        <i className="mgc_search_2_fill text-lg text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        {value && (
          <button
            onClick={onClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 text-sm"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
