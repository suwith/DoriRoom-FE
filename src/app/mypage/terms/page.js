// app/mypage/terms/page.jsx
'use client';

import { useState } from 'react';
import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import { terms } from '@/lib/mypage-agreements';

export default function TermsPage() {
  const [openId, setOpenId] = useState(null);

  const toggleOpen = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div
      className="min-h-full flex flex-col px-4 layout-padding-tb"
      style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}
    >
      <HeaderNavigationBar title="이용약관" className="bg-background" />

      <div className="flex-1 flex flex-col gap-4">
        {terms.map((term) => (
          <div
            key={term.id}
            className="bg-neutral-100 rounded-lg overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggleOpen(term.id)}
              className="w-full flex justify-between items-center px-4 py-3 font-semibold"
            >
              {term.title}
              <i
                className={`mgc_down_fill transition-transform ${
                  openId === term.id ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openId === term.id && (
              <div className="px-4 pb-3 text-sm text-neutral-600 whitespace-pre-line leading-relaxed">
                <hr className="border-t border-neutral-200 pb-3" />
                {term.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
