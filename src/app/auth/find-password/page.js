'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFindPasswordStore } from '@/stores/useFindPasswordStore';
import { resetPassword } from '@/hooks/auth/useFindPassword';
import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import PrimaryButton from '@/app/_components/PrimaryButton';
import PasswordInput from '@/app/auth/_components/PasswordInput';
import LoadingModal from '@/app/_components/LoadingModal';

// 회원가입 페이지에서 쓰던 비밀번호 유효성 검사 그대로 사용
function validPassword(pw) {
  if (!pw) return false;
  const lenOk = pw.length >= 6 && pw.length <= 20;
  const types = [
    /[a-zA-Z]/.test(pw),
    /[0-9]/.test(pw),
    /[^a-zA-Z0-9]/.test(pw),
  ].filter(Boolean).length;
  return lenOk && types >= 2;
}

export default function ResetPasswordPage() {
  const { email, resetToken, username, reset } = useFindPasswordStore();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const passwordOk = validPassword(password);
  const passwordMatch = password && password === passwordConfirm;
  const formValid = passwordOk && passwordMatch;

  async function onSubmit(e) {
    e.preventDefault();
    if (!formValid) {
      if (!passwordOk) return setErr('비밀번호 조건을 충족해 주세요.');
      if (!passwordMatch) return setErr('비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);
    setErr(null);
    try {
      await resetPassword({ email, resetToken, newPassword: password }); // resetToken 사용
      reset();
      router.replace('/login');
    } catch (e2) {
      setErr(e2?.message || '비밀번호 재설정 실패');
    } finally {
      setLoading(false);
    }
  }

  // footer safe-area 계산
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
      className="min-h-full flex flex-col px-4 pt-28 space-y-6"
      style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}
    >
      <HeaderNavigationBar title="비밀번호 재설정" />

      <div className="flex flex-col font-medium gap-3">
        <p>아이디</p>
        <p>{username}</p>
      </div>

      <form
        id="reset-password-form"
        onSubmit={onSubmit}
        className="flex-1 flex flex-col"
      >
        {/* 비밀번호 */}
        <div className="mb-7">
          <PasswordInput
            id="password"
            label="비밀번호를 재설정 해주세요."
            placeholder="비밀번호"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-2"
          />
          <PasswordInput
            id="passwordConfirm"
            placeholder="비밀번호 확인"
            autoComplete="new-password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
          <p className="mt-2 text-xs text-neutral-600 flex flex-col">
            <span>영문 대/소문자, 숫자, 특수문자 중 2가지 이상 조합</span>
            <span>6~20자 이내로 설정해 주세요.</span>
          </p>

          {/* 유효성 안내 */}
          {!passwordOk && password ? (
            <div className="mt-1 text-xs text-red-600 space-y-1">
              <p className="items-center flex gap-1">
                <i className="mgc_warning_fill text-md pb-0.5" />
                비밀번호 조건을 만족하지 않습니다.
              </p>
            </div>
          ) : null}
          {password && passwordConfirm && !passwordMatch ? (
            <p className="mt-1 text-xs text-red-600 items-center flex gap-1">
              <i className="mgc_warning_fill text-md pb-0.5" />
              비밀번호가 일치하지 않습니다.
            </p>
          ) : null}
          {passwordOk && passwordMatch ? (
            <p className="mt-1 text-xs text-main-100 items-center flex gap-1">
              <i className="mgc_check_fill text-md pb-0.5" />
              확인이 완료되었습니다.
            </p>
          ) : null}
        </div>

        {err && (
          <p className="mt-1 text-sm text-red-600 items-center flex gap-1">
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
        className="sticky left-0 right-0 pt-4 pb-7"
        style={{
          bottom: 'calc(env(safe-area-inset-bottom) + var(--kb-offset,0px))',
        }}
      >
        <PrimaryButton
          type="button"
          disabled={loading || !formValid}
          onClick={(e) => {
            const formEl =
              e.currentTarget.closest('div')?.previousElementSibling;
            if (formEl?.tagName === 'FORM') formEl.requestSubmit();
          }}
        >
          변경 완료
        </PrimaryButton>
      </div>

      <LoadingModal open={loading} />
    </div>
  );
}
