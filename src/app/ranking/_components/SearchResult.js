'use client';

import { useRouter } from 'next/navigation';
import RankingCard from './RankingCard';
import React from 'react';

export default function SearchResult({ query, results }) {
  const router = useRouter();

  if (!results || results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col flex-1 items-center justify-center gap-3 min-h-[calc(100vh-200px)]">
          <i className="mgc_sweats_fill text-6xl text-main-100" />
          <p className="text-center text-lg font-semibold">
            앗, 관련 유저가 없어요!
          </p>
          <p className="text-center text-sm text-neutral-500">
            다른 키워드로 다시 검색해 주세요 😢
          </p>
          <button
            onClick={() => router.push('/ranking')}
            className="mt-4 px-6 py-2 rounded-md bg-main-5 text-main-100 text-xl font-medium "
          >
            랭킹 메인으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {results.map((user) => (
        <div
          key={user.userId}
          onClick={() => router.push(`/neighbor/${user.userId}`)}
          className="cursor-pointer"
        >
          <RankingCard user={user} />
        </div>
      ))}
    </div>
  );
}
