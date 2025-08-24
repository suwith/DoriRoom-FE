// app/login/page.jsx
'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useLogin from '@/hooks/auth/useLogin';
import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import TextInput from '@/app/auth/_components/TextInput';
import PasswordInput from '@/app/auth/_components/PasswordInput';
import PrimaryButton from '@/app/_components/PrimaryButton';
import Link from 'next/link';

export default function LoginPage() {
  const { login, loggingIn, error } = useLogin();
  const router = useRouter();
  const search = useSearchParams();
  const [form, setForm] = useState({
    username: '',
    password: '',
    remember: true,
  });
  const redirect = search.get('redirect') || '/';
  const isValid = form.username.trim() && form.password.trim();
  const formId = 'login-form';

  async function onSubmit(e) {
    e.preventDefault();
    if (!isValid) return;
    try {
      await login(form);
      router.replace(redirect);
    } catch (_) {}
  }

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
      <HeaderNavigationBar title="로그인" />

      <form id={formId} onSubmit={onSubmit} className="flex-1 flex flex-col">
        <TextInput
          id="username"
          label="아이디를 입력해주세요."
          placeholder="아이디"
          autoComplete="username"
          value={form.username}
          onChange={(e) => setForm((s) => ({ ...s, username: e.target.value }))}
          required
          className="mb-2"
        />
        {error?.field === 'username' ? (
          <p className="mt-1 mb-4 text-xs text-red-600 items-center flex gap-1">
            <i className="mgc_warning_fill text-md pb-0.5" />
            {error.message}
          </p>
        ) : (
          <div className="mb-7" />
        )}

        <PasswordInput
          id="password"
          label="비밀번호를 입력해주세요."
          placeholder="비밀번호"
          autoComplete="current-password"
          value={form.password}
          onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
          required
          className="mb-2"
        />
        {error?.field === 'password' ? (
          <p className="mt-1 mb-4 text-xs text-red-600 items-center flex gap-1">
            <i className="mgc_warning_fill text-md pb-0.5" />
            {error.message}
          </p>
        ) : (
          <div className="mb-4" />
        )}

        <label className="inline-flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={form.remember}
            onChange={(e) =>
              setForm((s) => ({ ...s, remember: e.target.checked }))
            }
            className="rounded border-gray-300"
          />
          로그인 상태 유지
        </label>

        {error?.field === 'form' ? (
          <p className="mt-3 text-sm text-red-600">{error.message}</p>
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
        className="sticky left-0 right-0 pt-4 pb-7 space-y-5"
        style={{
          bottom: 'calc(env(safe-area-inset-bottom) + var(--kb-offset, 0px))',
        }}
      >
        <div className="mt-2 flex items-center justify-center gap-4 text-neutral-400">
          <Link href="/auth/find-id">아이디 찾기</Link>
          <span>|</span>
          <Link href="/auth/find-password">비밀번호 찾기</Link>
        </div>
        <PrimaryButton
          type="submit"
          disabled={!isValid || loggingIn}
          form={formId}
        >
          {loggingIn ? '로그인 중...' : '로그인하기'}
        </PrimaryButton>
      </div>
    </div>
  );
}
