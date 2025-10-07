'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSignupStore } from '@/stores/useSignupStore';
import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import PrimaryButton from '@/app/_components/PrimaryButton';
import { sendSignupEmail, verifySignupCode } from '@/hooks/auth/useSignup';
import LoadingModal from '@/app/_components/LoadingModal';
import { useToast } from '@/app/_providers/ToastProvider';

export default function SignupCodePage() {
  const router = useRouter();
  const email = useSignupStore((s) => s.email);
  const [digits, setDigits] = useState(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const inputsRef = useRef([]);

  const { show } = useToast();

  useEffect(() => {
    if (!email) router.replace('/signup/email');
  }, [email, router]);

  function focusIndex(idx) {
    inputsRef.current[idx]?.focus();
    inputsRef.current[idx]?.select?.();
  }

  function onChangeDigit(i, v) {
    const digit = v.replace(/\D/g, '').slice(0, 1);
    setDigits((prev) => {
      const next = [...prev];
      next[i] = digit;
      return next;
    });
    if (digit && i < 5) focusIndex(i + 1);
  }

  function onKeyDown(i, e) {
    if (e.key === 'Backspace') {
      if (digits[i]) {
        setDigits((prev) => {
          const next = [...prev];
          next[i] = '';
          return next;
        });
      } else if (i > 0) {
        focusIndex(i - 1);
        setDigits((prev) => {
          const next = [...prev];
          next[i - 1] = '';
          return next;
        });
      }
      e.preventDefault();
    }
    if (e.key === 'ArrowLeft' && i > 0) {
      focusIndex(i - 1);
      e.preventDefault();
    }
    if (e.key === 'ArrowRight' && i < 5) {
      focusIndex(i + 1);
      e.preventDefault();
    }
  }

  function onPaste(e) {
    e.preventDefault();
    const text = (e.clipboardData.getData('text') || '')
      .replace(/\D/g, '')
      .slice(0, 6);
    if (!text) return;
    const filled = text.split('');
    setDigits(() => {
      const next = Array(6).fill('');
      for (let i = 0; i < filled.length; i += 1) next[i] = filled[i];
      return next;
    });

    focusIndex(Math.min(filled.length - 1, 5));
  }

  async function onResend() {
    if (!email) return;
    setLoading(true);
    try {
      await sendSignupEmail(email);
      show({ message: '인증코드가 다시 발송되었습니다.', variant: 'success' });
    } catch (e) {
      show({ message: '인증코드 발송에 실패했습니다.', variant: 'error' });
    } finally {
      setLoading(false);
    }
  }

  const isValid = digits.filter((d) => /\d/.test(d)).length === 6;

  async function onSubmit(e) {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    setErr(null);
    const code = digits.join('');
    try {
      await verifySignupCode({ email, code });
      router.replace('/signup/info');
    } catch (e2) {
      const msg =
        (typeof e2 === 'string' && e2) ||
        e2?.message ||
        '인증코드 확인 중 오류가 발생했습니다.';
      setErr(msg);
    } finally {
      setLoading(false);
    }
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
    style.textContent = `input,button,select,textarea{scroll-margin-bottom:calc(var(--footer-h,72px) + env(safe-area-inset-bottom) + var(--kb-offset,0px) + 12px);}`;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div
      className="min-h-full w-screen flex flex-col px-4 header-padding-tb"
      style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}
    >
      <div className="bg-background">
        <HeaderNavigationBar title="회원가입" className="bg-background" />
      </div>

      {/* 폼에 id 부여 */}
      <form
        id="signup-code-form"
        onSubmit={onSubmit}
        className="flex-1 flex flex-col gap-5 w-full"
      >
        <div className="flex items-start font-medium text-md gap-0 flex-col">
          <span>{email}로</span>
          <span>전송된 인증코드 6자리를 입력해 주세요.</span>
        </div>

        <div className="w-full flex items-center justify-center">
          <div className="flex justify-between w-[80%] items-center gap-0.5">
            {Array.from({ length: 6 }).map((_, i) => {
              const digit = digits[i] || '';
              const isFilled = digit.trim() !== '';
              return (
                <input
                  key={i}
                  ref={(el) => (inputsRef.current[i] = el)}
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  className={`w-10 h-12 text-center text-lg rounded-[10px] focus:outline-none focus:ring-0 ${
                    isFilled
                      ? 'bg-main-5 text-main-100 font-semibold'
                      : 'bg-neutral-100 text-main'
                  }`}
                  onChange={(e) => onChangeDigit(i, e.target.value)}
                  onKeyDown={(e) => onKeyDown(i, e)}
                  onPaste={i === 0 ? onPaste : undefined}
                />
              );
            })}
          </div>
        </div>
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
        className="sticky left-0 right-0 pt-4 w-full"
        style={{
          bottom: 'calc(env(safe-area-inset-bottom) + var(--kb-offset, 0px))',
        }}
      >
        <div className="flex flex-col w-full items-center gap-4">
          <button
            type="button"
            onClick={onResend}
            disabled={loading}
            className="w-auto text-sm text-neutral-400 border-b-1 border-neutral-400 mb-4"
          >
            인증코드 다시 받기
          </button>

          {/* 폼 밖의 버튼이지만 form 속성으로 submit 보장 */}
          <PrimaryButton
            type="submit"
            className=""
            disabled={loading || !isValid}
            onClick={undefined}
            form="signup-code-form"
          >
            입력 완료
          </PrimaryButton>
        </div>
      </div>
      <LoadingModal open={loading} />
    </div>
  );
}
