'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFindPasswordStore } from '@/stores/useFindPasswordStore';
import { sendPasswordResetCode } from '@/hooks/auth/useFindPassword';
import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import TextInput from '@/app/auth/_components/TextInput';
import PrimaryButton from '@/app/_components/PrimaryButton';
import LoadingModal from '@/app/_components/LoadingModal';

export default function FindPasswordEmailPage() {
  const router = useRouter();
  const { email, setEmail } = useFindPasswordStore();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setErr(null);
    try {
      await sendPasswordResetCode(email);
      router.push('/auth/find-password/code');
    } catch (e2) {
      setErr(e2?.message || '인증코드 전송 실패. 이메일을 확인해주세요.');
    } finally {
      setLoading(false);
    }
  }

  const isValid = !!email.trim();

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
    style.textContent = `input,button,select,textarea{scroll-margin-bottom:calc(var(--footer-h,72px) + env(safe-area-inset-bottom) + var(--kb-offset,0px) + 12px);}`;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div
      className="min-h-full flex flex-col px-4 w-screen header-padding-tb"
      style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}
    >
      <HeaderNavigationBar
        title="비밀번호 찾기"
        onBackClick={() => setEmail('')}
      />

      <form onSubmit={onSubmit} className="flex-1 flex flex-col gap-4">
        <TextInput
          id="email"
          label="이메일"
          placeholder="이메일을 입력해주세요."
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {err && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <i className="mgc_warning_fill text-md pb-0.5" />
            {err}
          </p>
        )}

        <div
          aria-hidden
          style={{
            height:
              'calc(var(--footer-h,72px) + env(safe-area-inset-bottom) + var(--kb-offset,0px))',
          }}
        />
      </form>

      <div
        ref={footerRef}
        className="sticky left-0 right-0 pt-4"
        style={{
          bottom: 'calc(env(safe-area-inset-bottom) + var(--kb-offset, 0px))',
        }}
      >
        <PrimaryButton
          type="button"
          disabled={loading || !isValid}
          onClick={(e) => {
            const formEl =
              e.currentTarget.closest('div')?.previousElementSibling;
            if (formEl?.tagName === 'FORM') formEl.requestSubmit();
          }}
        >
          인증코드 발송하기
        </PrimaryButton>
      </div>

      <LoadingModal open={loading} />
    </div>
  );
}
