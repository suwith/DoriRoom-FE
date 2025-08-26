// app/signup/profileImage/page.jsx
'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSignupStore } from '@/stores/useSignupStore';
import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import ImageUploader from '@/app/_components/ImageUploader';
import PrimaryButton from '@/app/_components/PrimaryButton';
import { submitSignupProfile } from '@/hooks/auth/useSignup';

export default function SignupAvatarPage() {
  const router = useRouter();
  const { email, profile, setProfile, reset } = useSignupStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) router.replace('/signup/email');
  }, [email, router]);

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

  async function finishSignup(withImage) {
    if (loading) return;
    setLoading(true);
    try {
      await submitSignupProfile({
        email,
        username: profile.username,
        password: profile.password,
        nickname: profile.nickname,
        profileImage: withImage ? profile.profileImage : null,
      });
      reset();
      router.replace('/login?from=signup');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-full flex flex-col px-4 pt-28"
      style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}
    >
      <HeaderNavigationBar
        title="회원가입"
        onBack={() => router.replace('/signup/info')}
      />

      <div className="flex-1 flex flex-col items-center">
        <p className="w-full text-left mb-6 font-medium">
          프로필 사진을 등록해 주세요.
        </p>
        <div className="mt-2 mb-10">
          <ImageUploader
            value={profile.profileImage}
            onChange={(file) => setProfile({ profileImage: file })}
            size={120}
            rounded
          />
        </div>
      </div>

      <div
        ref={footerRef}
        className="sticky left-0 right-0 pt-2 pb-7 space-y-3"
        style={{
          bottom: 'calc(env(safe-area-inset-bottom) + var(--kb-offset, 0px))',
        }}
      >
        <div className="flex flex-col w-full items-center gap-4">
          <button
            type="button"
            disabled={loading}
            onClick={() => finishSignup(false)} // 회원가입 진행하되 profileImage는 null로 전송
            className="w-18 text-sm text-neutral-400 border-b-1 border-neutral-400 mb-4"
          >
            다음에 하기
          </button>

          <PrimaryButton
            type="button"
            disabled={loading}
            onClick={() => finishSignup(true)} // 현재 선택된 이미지까지 함께 전송
          >
            {loading ? '처리 중...' : '가입 완료'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
