'use client';

import RankingCard from './RankingCard';

export default function RankingList({ users }) {
  return (
    <div className="space-y-3">
      {users.map((user) => (
        <RankingCard key={user.userId} user={user} />
      ))}
    </div>
  );
}
