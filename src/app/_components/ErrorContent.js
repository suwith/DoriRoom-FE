'use client';

import { useRouter } from 'next/navigation';

export default function ErrorContent({ error }) {
  const router = useRouter();
  if (!error) return null;

  return (
    <div className="flex w-full h-full flex-col items-center justify-center  gap-4">
      <i className="mgc_sweats_fill text-5xl text-main-100" />

      <div className="text-center text-lg font-semibold">{error}</div>

      <button
        onClick={() => router.back()}
        className="mt-2 px-4 py-2 rounded-lg bg-main-100 text-background whitespace-nowrap text-sm hover:bg-main-80 transition"
      >
        이전 화면으로 돌아가기
      </button>
    </div>
  );
}
