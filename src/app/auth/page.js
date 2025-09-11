// app/auth/page.jsx
'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function AuthPage() {
  return (
    <div className="min-h-screen pb-10 flex flex-col items-center justify-between px-6 py-8">
      <div />
      <div className="flex flex-col items-center pb-[50%]">
        <Image
          src="/images/doriroom_logo.svg"
          alt="Dori Room"
          width={160}
          height={160}
          priority
        />
      </div>

      <div className="w-full space-y-4">
        <Link
          href="/signup/agreements"
          className="block w-full text-center rounded-[10px] bg-main-100 text-background py-2.5 font-semibold text-lg"
        >
          회원가입
        </Link>
        <Link
          href="/login"
          className="block w-full text-center rounded-[10px] bg-main-5 text-main-100 py-2.5 font-semibold text-lg"
        >
          로그인
        </Link>

        <div className="mt-2 flex items-center justify-center gap-4 text-neutral-400">
          <Link href="/auth/find-id/email">아이디 찾기</Link>
          <span>|</span>
          <Link href="/auth/find-password/email">비밀번호 찾기</Link>
        </div>
      </div>
    </div>
  );
}
