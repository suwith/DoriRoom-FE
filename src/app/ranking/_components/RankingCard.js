'use client';

import { Icon } from '@iconify/react';
import manifest from '@/data/manifest.json';
import { useRouter } from 'next/navigation';

export default function RankingCard({ user, isMy = false }) {
  const router = useRouter();
  // APPAREL 아이템 ID 가져오기 (없으면 31번 기본값)
  const APPARELID =
    user.equippedItems?.find((i) => i.itemType === 'APPAREL')?.itemId ?? 31;

  // 닉네임 7자 제한
  const displayName =
    user.nickname?.length > 7 ? user.nickname.slice(0, 7) + '…' : user.nickname;

  const handleClick = () => {
    if (isMy) return;
    router.push(`/neighbor/${user.userId}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`border-1 rounded-lg px-3 py-4 flex items-center gap-3 mb-3 ${
        isMy ? 'bg-sub-5 border-sub-15' : 'bg-main-5 border-main-15'
      }`}
    >
      {/* 왕관 + 숫자 */}
      <div className="relative flex items-center justify-center w-8 h-8">
        <Icon
          icon="material-symbols:crown-rounded"
          className={`w-15 h-15 ${isMy ? 'text-yellow-500' : 'text-main-100'}`}
        />
        <span className="absolute text-[9px] font-bold text-background">
          {user.rank}
        </span>
      </div>

      {/* 프로필 (equippedItems -> manifest) */}
      <img
        src={manifest.items?.[APPARELID]?.asset?.guest}
        alt="profile"
        className="w-20 h-20 rounded-full object-cover"
      />

      {/* 닉네임 + speech */}
      <div className="flex w-full items-center justify-between">
        <div className="flex-col items-start space-y-1">
          {isMy && (
            <span className="text-xs bg-background text-sub-100 font-bold px-1 py-0.5">
              MY
            </span>
          )}

          {!isMy && (
            <>
              {user.following ? (
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="px-1.5 py-0.5 rounded bg-background text-main-100 text-xs"
                >
                  팔로잉
                </button>
              ) : (
                <button className="px-1.5 py-0.5 rounded bg-main-100 text-background text-xs">
                  + 팔로우
                </button>
              )}
            </>
          )}
          {/* 닉네임 7자 제한 */}
          <p className="text-[15px] font-bold truncate max-w-[7ch]">
            {displayName}
          </p>
        </div>

        {/* speech: 한 줄에 10자, 최대 2줄 */}
        <p
          className="text-xs text-gray-600 text-right"
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
        </p>
      </div>
    </div>
  );
}
