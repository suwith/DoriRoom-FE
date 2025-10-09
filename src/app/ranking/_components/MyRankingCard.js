'use client';

import { Icon } from '@iconify/react';
import manifest from '@/data/manifest.json';
import React from 'react';

export default function MyRankingCard({ user }) {
  const APPARELID =
    user.equippedItems?.find((i) => i.itemType === 'APPAREL')?.itemId ?? 31;
  const displayName =
    user.nickname?.length > 7 ? user.nickname.slice(0, 7) + '…' : user.nickname;

  return (
    <div className="flex items-center gap-3 mb-3 px-2">
      {/* 왕관 + 숫자 */}
      <div className="relative flex items-center justify-center w-8 h-8">
        <Icon
          icon="material-symbols:crown-rounded"
          className="w-15 h-15 text-sub-100"
        />
        <span className="absolute text-[9px] font-bold text-background">
          {user.rank}
        </span>
      </div>

      {/* 프로필 */}
      <img
        src={manifest.items?.[APPARELID]?.asset?.guest}
        alt="profile"
        className="w-20 h-20 rounded-full object-cover"
      />

      <div className="flex w-full items-center justify-between">
        <div className="flex-col items-start space-y-1">
          <span className="text-xs bg-background text-sub-100 font-bold px-1 py-0.5">
            MY
          </span>
          <p className="text-[15px] font-bold truncate max-w-[7ch]">
            {displayName}
          </p>
        </div>
        <div
          className="text-xs text-neutral-500 text-right bg-neutral-100 py-2 px-3 rounded-lg rounded-bl-none"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            maxWidth: '20ch',
            lineHeight: '1.2rem',
          }}
        >
          {user.speech}
        </div>
      </div>
    </div>
  );
}
