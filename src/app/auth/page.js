// app/auth/page.jsx
'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function AuthPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-4 layout-padding-b">
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
          href="/signup/email"
          className="block w-full text-center rounded-[10px] bg-main-100 text-white py-2.5 font-semibold text-lg"
        >
          회원가입
        </Link>
        <Link
          href="/login"
          className="block w-full text-center rounded-[10px] bg-main-5 text-main-100 py-2.5 font-semibold text-lg"
        >
          로그인
        </Link>

        <div className="flex items-center justify-center gap-4 text-neutral-400 pb-3">
          <Link href="/">아이디 찾기</Link>
          <span>|</span>
          <Link href="/">비밀번호 찾기</Link>
        </div>
      </div>
    </div>
  );
}
