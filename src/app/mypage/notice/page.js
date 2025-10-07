'use client';

import { useMemo, useState } from 'react';
import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import { notices } from '@/lib/notices';

export default function NoticePage() {
  const [openId, setOpenId] = useState(null);
  const toggleOpen = (id) => setOpenId(openId === id ? null : id);

  // UI에서는 최신순으로 정렬
  const sortedNotices = useMemo(
    () =>
      [...notices].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    []
  );

  return (
    <div
      className="min-h-full flex flex-col px-4 layout-padding-tb"
      style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}
    >
      <HeaderNavigationBar title="공지사항" className="bg-background" />

      <div className="flex-1 flex flex-col gap-4">
        {sortedNotices.map((notice) => (
          <div
            key={notice.id}
            className="bg-neutral-100 rounded-lg overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggleOpen(notice.id)}
              className="w-full flex justify-between items-center px-4 py-3 font-semibold text-left"
            >
              <div className="flex flex-col items-start">
                <span>{notice.title}</span>
                <span className="text-xs text-neutral-500 mt-0.5">
                  {notice.date}
                </span>
              </div>
              <i
                className={`mgc_down_fill transition-transform ${
                  openId === notice.id ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openId === notice.id && (
              <div className="px-4 pb-3 text-sm text-neutral-600 whitespace-pre-line leading-relaxed">
                <hr className="border-t border-neutral-200 pb-3" />
                {notice.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
