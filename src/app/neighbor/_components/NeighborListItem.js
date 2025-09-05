'use client';

import { useRouter } from 'next/navigation';

export default function NeighborListItem({
  user,
  mode = 'list',
  checked = false,
  onUnfollow,
  onToggle,
}) {
  const router = useRouter();

  return (
    <li
      onClick={(e) => {
        if (mode !== 'manage') {
          e.stopPropagation();
          router.push(`/neighbor/${user.userId}`);
        }
      }}
      className="flex items-center justify-between py-3 cursor-pointer"
    >
      {/* 왼쪽: 프로필 + 닉네임 + 단짝 표시 */}
      <div className="flex items-center gap-2">
        <img
          src={user.profileImageUrl || '/images/profileImage_default.svg'}
          alt="프로필"
          className="w-10 h-10 rounded-full"
        />
        <span className="text-sm">{user.nickname}</span>
        {user.isBestFriend && (
          <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 flex items-center justify-center">
            <i className="mgc_star_fill text-background text-[8px]" />
          </div>
        )}
      </div>

      {/* 오른쪽: 모드별 UI */}
      {mode === 'followers' && (
        <>
          {user.isMutualFollow ? (
            <span
              onClick={(e) => e.stopPropagation()}
              className="px-3 py-1 text-xs bg-green-100 text-green-600 rounded"
            >
              맞팔로우
            </span>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUnfollow?.(user.userId);
              }}
            >
              <i className="mgc_close_fill text-neutral-400" />
            </button>
          )}
        </>
      )}
      {mode === 'followings' && (
        <>
          {user.isMutualFollow ? (
            <span
              onClick={(e) => e.stopPropagation()}
              className="px-3 py-1 text-xs bg-green-100 text-green-600 rounded-[4px]"
            >
              맞팔로우
            </span>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUnfollow?.(user.userId);
              }}
              className="px-2 py-1 text-xs bg-main-5 text-main-100 rounded-[4px]"
            >
              팔로잉
            </button>
          )}
        </>
      )}

      {mode === 'manage' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle?.(user.userId, !checked);
          }}
        >
          {checked ? (
            <i
              className={`flex mgc_check_circle_fill text-main-100 text-xl }`}
            />
          ) : (
            <i
              className={`w-4 h-4 mr-0.5 flex items-center justify-center rounded-full border
              text-main-100
              }`}
            />
          )}
        </button>
      )}
    </li>
  );
}
