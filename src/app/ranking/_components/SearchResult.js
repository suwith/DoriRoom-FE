'use client';

import { useRouter } from 'next/navigation';
import RankingCard from './RankingCard';
import ErrorContent from '@/app/_components/ErrorContent';

export default function SearchResult({ query, results }) {
  const router = useRouter();

  if (!results || results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-20">
        <ErrorContent error="앗,관련 유저가 없어요!" />
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
