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
import LoadingModal from '@/app/_components/LoadingModal';

export default function LoginPage() {
  const { login, loggingIn, error } = useLogin();
  const router = useRouter();
  const search = useSearchParams();

  const [form, setForm] = useState({
    username: '',
    password: '',
    remember: true,
  });

  // 키보드 열림 감지
  const [kbOpen, setKbOpen] = useState(false);

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

  // Footer 실제 높이를 CSS 변수로 보관
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

  // 포커스된 입력이 푸터/키보드에 가려지지 않게 scroll-margin-bottom 제공
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent =
      'input,button,select,textarea{scroll-margin-bottom:calc(var(--footer-h,72px) + env(safe-area-inset-bottom) + var(--kb-offset,0px) + 12px);}';
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // 키보드 열림 여부 계산
  useEffect(() => {
    const vv = window.visualViewport;
    const handler = () => {
      if (!vv) {
        setKbOpen(false);
        return;
      }
      const diff = Math.max(
        0,
        window.innerHeight - vv.height - (vv.offsetTop || 0)
      );
      setKbOpen(diff > 140); // 임계값은 120~180 사이에서 조정 가능
    };
    handler();
    vv?.addEventListener('resize', handler);
    vv?.addEventListener('scroll', handler);
    window.addEventListener('orientationchange', handler);
    window.addEventListener('resize', handler);
    return () => {
      vv?.removeEventListener('resize', handler);
      vv?.removeEventListener('scroll', handler);
      window.removeEventListener('orientationchange', handler);
      window.removeEventListener('resize', handler);
    };
  }, []);

  return (
    <div
      className="flex flex-col px-4 pt-28"
      // 키보드 열릴 때는 페이지 전체 스크롤을 잠궈서 버튼 아래로 내려갈 수 없게 한다
      style={{
        minHeight: 'calc(var(--vh, 1vh) * 100)',
        overflow: kbOpen ? 'hidden' : 'visible',
      }}
    >
      <HeaderNavigationBar title="로그인" />

      {/* 폼 스크롤 영역:
          - 닫힘: 자연 흐름, 스크롤 필요 없으면 생기지 않음
          - 열림: 키보드·푸터 영역을 제외한 높이까지만 스크롤 허용 */}
      <div
        className="flex-1"
        style={{
          height:
            'calc(var(--vh, 1vh) * 100 - (var(--footer-h,72px) + env(safe-area-inset-bottom)))',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          overscrollBehaviorY: 'contain',
        }}
      >
        <form id={formId} onSubmit={onSubmit} className="flex flex-col">
          <TextInput
            id="username"
            label="아이디를 입력해주세요."
            placeholder="아이디"
            autoComplete="username"
            value={form.username}
            onChange={(e) =>
              setForm((s) => ({ ...s, username: e.target.value }))
            }
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
            onChange={(e) =>
              setForm((s) => ({ ...s, password: e.target.value }))
            }
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
        </form>
      </div>

      {/* 푸터:
          - 항상 하단 고정 + pb-7 유지
          - 키보드 있을 때는 키보드 바로 위로 고정 */}
      <div
        ref={footerRef}
        className="fixed left-0 right-0 mx-auto max-w-[390px] px-4 pt-4 pb-7 space-y-5"
        style={{
          bottom: 'calc(env(safe-area-inset-bottom) + var(--kb-offset, 0px))',
          pointerEvents: 'auto',
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

      <LoadingModal open={loggingIn} />
    </div>
  );
}
