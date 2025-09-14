// app/signup/email/page.jsx
'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSignupStore } from '@/stores/useSignupStore';
import { sendSignupEmail } from '@/hooks/auth/useSignup';
import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import TextInput from '@/app/auth/_components/TextInput';
import PrimaryButton from '@/app/_components/PrimaryButton';
import LoadingModal from '@/app/_components/LoadingModal';

export default function SignupEmailPage() {
  const router = useRouter();
  const { email, setEmail } = useSignupStore();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setErr(null);
    try {
      await sendSignupEmail(email);
      router.push('/signup/code');
    } catch (e2) {
      const msg =
        (typeof e2 === 'string' && e2) ||
        e2?.message ||
        '인증코드 전송에 실패했습니다. 이메일을 확인해주세요.';
      setErr(msg);
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
      className="flex flex-col px-4 layout-padding-tb"
      style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}
    >
      <HeaderNavigationBar
        title="회원가입"
        onBackClick={() => {
          setEmail('');
        }}
      />

      <form onSubmit={onSubmit} className="flex-1 flex flex-col">
        <TextInput
          id="email"
          label="이메일을 입력해주세요."
          placeholder="이메일"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-4"
        />

        {err ? (
          <p className="text-xs text-red-600 items-center flex gap-1">
            <i className="mgc_warning_fill text-md pb-0.5" />
            {err}
          </p>
        ) : null}

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
