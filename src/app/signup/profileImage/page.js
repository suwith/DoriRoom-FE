'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSignupStore } from '@/stores/useSignupStore';
import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import ImageUploader from '@/app/_components/ImageUploader';
import PrimaryButton from '@/app/_components/PrimaryButton';
import { uploadProfileImage } from '@/hooks/auth/useSignup';
import LoadingModal from '@/app/_components/LoadingModal';
import { useAuthStore } from '@/stores/useAuthStore';

export default function SignupAvatarPage() {
  const router = useRouter();
  const { email, profile, setProfile, reset } = useSignupStore();
  const [loading, setLoading] = useState(false);

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

  async function handleUpload() {
    if (loading || !profile.profileImage) return;
    setLoading(true);
    try {
      await uploadProfileImage(profile.profileImage);

      // 프로필 등록 완료 후 토큰 제거
      const { clearTokens } = useAuthStore.getState();
      clearTokens();

      await router.replace('/login');
      setTimeout(() => reset(), 0);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-full flex flex-col px-4 header-padding-tb w-screen"
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
        className="sticky left-0 right-0 pt-2 space-y-3"
        style={{
          bottom: 'calc(env(safe-area-inset-bottom) + var(--kb-offset, 0px))',
        }}
      >
        <div className="flex flex-col w-full items-center gap-4">
          <button
            type="button"
            disabled={loading}
            onClick={() => router.replace('/login')}
            className="w-18 text-sm text-neutral-400 border-b-1 border-neutral-400 mb-4"
          >
            다음에 하기
          </button>

          <PrimaryButton
            type="button"
            disabled={loading || !profile.profileImage}
            onClick={handleUpload}
          >
            가입 완료
          </PrimaryButton>
        </div>
      </div>

      <LoadingModal open={loading} />
    </div>
  );
}
