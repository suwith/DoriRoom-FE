// app/signup/agreements/page.jsx
'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import PrimaryButton from '@/app/_components/PrimaryButton';
import { terms } from '@/lib/signup-agreements';

export default function SignupAgreementsPage() {
  const router = useRouter();
  const [openId, setOpenId] = useState(null);
  const [agreements, setAgreements] = useState({
    service: null,
    privacy: null,
    location: null,
  });

  const allAgreed = Object.values(agreements).every((v) => v === true);

  const toggleOpen = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const handleCheck = (id, value) => {
    setAgreements((prev) => ({ ...prev, [id]: value }));
  };

  const footerRef = useRef(null);
  useLayoutEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const setVar = () => {
      const h = el.getBoundingClientRect().height || 0;
      document.documentElement.style.setProperty(
        '--footer-h',
        `${Math.ceil(h)}px`
      );
    };
    setVar();
    const ro = new ResizeObserver(setVar);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent =
      'input,button,select,textarea{scroll-margin-bottom:calc(var(--footer-h,72px) + env(safe-area-inset-bottom) + var(--kb-offset,0px) + 12px);}';
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div
      className="min-h-full flex flex-col px-4 pt-28"
      style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}
    >
      <HeaderNavigationBar title="회원가입" onBackClick={() => router.back()} />

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
              <div className="px-4 py-3 text-sm text-neutral-600 whitespace-pre-line">
                {term.content}
              </div>
            )}
            <div className="flex gap-4 px-4 py-2 border-t border-neutral-200 justify-end text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`${term.id}-agree`}
                  checked={agreements[term.id] === true}
                  onChange={() => handleCheck(term.id, true)}
                />
                동의
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`${term.id}-agree`}
                  checked={agreements[term.id] === false}
                  onChange={() => handleCheck(term.id, false)}
                />
                비동의
              </label>
            </div>
          </div>
        ))}
      </div>

      <div
        ref={footerRef}
        className="sticky left-0 right-0 pt-4 pb-7 bg-white"
        style={{
          bottom: 'calc(env(safe-area-inset-bottom) + var(--kb-offset, 0px))',
        }}
      >
        <PrimaryButton
          type="button"
          disabled={!allAgreed}
          onClick={() => router.push('/signup/email')}
        >
          동의 완료
        </PrimaryButton>
      </div>
    </div>
  );
}
