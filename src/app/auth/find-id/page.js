'use client';

import { useRouter } from 'next/navigation';
import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import PrimaryButton from '@/app/_components/PrimaryButton';
import { useFindIdStore } from '@/stores/useFindIdStore';

export default function FindIdResultPage() {
  const router = useRouter();
  const { username, reset } = useFindIdStore();

  if (!username) {
    router.replace('/auth/find-id/email');
    return null;
  }
  return (
    <div
      className="min-h-full flex flex-col px-4 w-screen header-padding-tb"
      style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}
    >
      <HeaderNavigationBar title="아이디 찾기" />

      <div className="flex flex-col font-medium text-md gap-0">
        회원님의 아이디 정보입니다.
      </div>
      <div className="flex flex-col items-center py-3 bg-main-5 rounded-lg mt-6">
        <p className="text-lg">{username}</p>
      </div>

      {/* 버튼을 하단에 고정 */}
      <div
        className="sticky left-0 right-0 mt-auto flex flex-col gap-3"
        style={{
          bottom: 'calc(env(safe-area-inset-bottom) + var(--kb-offset,0px))',
        }}
      >
        <PrimaryButton
          type="button"
          onClick={() => {
            reset();
            router.push('/login');
          }}
        >
          로그인하러 가기
        </PrimaryButton>
        <button
          type="button"
          className="w-full rounded-lg py-3 font-medium transition text-center text-xl bg-main-5 text-main-100"
          onClick={() => {
            reset();
            router.push('/auth/find-password/email');
          }}
        >
          비밀번호 찾기
        </button>
      </div>
    </div>
  );
}
