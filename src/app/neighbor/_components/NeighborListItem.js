'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import TwoButtonModal from '@/app/_components/TwoButtonModal';
import { useToast } from '@/app/_providers/ToastProvider';
import useFollow from '@/hooks/follow/useFollow';

export default function NeighborListItem({
  user,
  mode = 'list',
  checked = false,
  onToggle,
  onFollowChange,
}) {
  const router = useRouter();

  const { status, follow, unfollow, removeFollower, fetchStatus, loading } =
    useFollow(user.userId);
  const isMutualFollow = status.isFollowedBy && status.isFollowing;

  const [showUnfollowModal, setShowUnfollowModal] = React.useState(false);

  const { show } = useToast();

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus, isMutualFollow]);

  const handleFollow = async (e, nickname) => {
    try {
      e.stopPropagation();
      await follow();
      show({
        message: `${nickname}님을 팔로우 했어요!`,
        variant: 'success',
      });
      onFollowChange?.();
    } catch (err) {
      show({
        message: '팔로우에 실패했습니다. 다시 시도해주세요.',
        variant: 'danger',
      });
    }
  };

  const handleUnfollow = async (e) => {
    try {
      e.stopPropagation();
      await unfollow();
      show({
        message: '팔로우 취소가 완료되었습니다.',
        variant: 'success',
      });
    } catch (err) {
      show({
        message: '팔로우 취소에 실패했습니다. 다시 시도해주세요.',
        variant: 'danger',
      });
    }
  };

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
        <div className="flex items-center gap-2">
          {!isMutualFollow && (
            <span
              onClick={(e) => handleFollow(e, user.nickname)}
              className="px-2 py-1 text-xs bg-main-100 text-background rounded"
            >
              맞팔로우
            </span>
          )}
          <button
            onClick={async (e) => {
              try {
                e.stopPropagation();
                await removeFollower();
                show({
                  message: `${user.nickname}님을 팔로워 리스트에서 삭제했어요.`,
                  variant: 'success',
                });
                onFollowChange?.();
              } catch (err) {
                show({
                  message: '팔로워 삭제에 실패했습니다. 다시 시도해주세요.',
                  variant: 'danger',
                });
              }
            }}
          >
            <i className="mgc_close_fill text-neutral-400" />
          </button>
        </div>
      )}

      {mode === 'followings' && (
        <>
          {status.isFollowing ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowUnfollowModal(true);
              }}
              className="px-2 py-1 rounded bg-main-5 text-main-100 text-xs"
              disabled={loading}
            >
              팔로잉
            </button>
          ) : (
            <button
              onClick={(e) => handleFollow(e, user.nickname)}
              className="px-2 py-1 rounded bg-main-100 text-background text-xs"
              disabled={loading}
            >
              + 팔로우
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
            <i className="flex mgc_check_circle_fill text-main-100 text-xl" />
          ) : (
            <i className="w-4 h-4 mr-0.5 flex items-center justify-center rounded-full border text-main-100" />
          )}
        </button>
      )}

      {showUnfollowModal && (
        <TwoButtonModal
          title="정말 팔로우를 취소하시겠어요?"
          cancelText="아니오"
          onCancel={(e) => {
            e.stopPropagation();
            setShowUnfollowModal(false);
          }}
          confirmText="네, 취소할래요"
          onConfirm={async (e) => {
            await handleUnfollow(e);
            setShowUnfollowModal(false);
          }}
        />
      )}
    </li>
  );
}
