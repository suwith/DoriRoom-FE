'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useFollow from '@/hooks/follow/useFollow';
import useNeighborRoom from '@/hooks/follow/useNeighborRoom';
import BackButton from '@/app/_components/BackButton';
import LoadingModal from '@/app/_components/LoadingModal';
import manifest from '@/data/manifest.json';
import RoomStatsCard from '@/app/_components/RoomStatsCard';
import Link from 'next/link';
import TwoButtonModal from '@/app/_components/TwoButtonModal';
import { useToast } from '@/app/_providers/ToastProvider';
import useRoomLike from '@/hooks/follow/useRoomLike';
import { useAuthStore } from '@/stores/useAuthStore';
import useBestFriendStatus from '@/hooks/follow/useBestFriendStatus';

const DEFAULT_FLOOR = 39;
const DEFAULT_SHELF = 38;
const DEFAULT_APPAREL = 31;
const DEFAULT_WINDOW = 40;

export default function NeighborHome() {
  const params = useParams();
  const userId = params.userId;
  const user = useAuthStore((state) => state.user);
  const isMine = user.userId === userId;

  const { status, follow, unfollow, fetchStatus, loading } = useFollow(userId);
  const { room, fetchRoom, loading: roomLoading } = useNeighborRoom(userId);
  const { likeCount, isLiked, toggleLike } = useRoomLike(userId);
  const { isBestFriend, fetchBestFriendStatus } = useBestFriendStatus(userId);

  const router = useRouter();
  const zIndex = manifest.defaults.zIndex;
  const equippedItems = Array.isArray(room?.equippedItems)
    ? room.equippedItems
    : [];

  const [showUnfollowModal, setShowUnfollowModal] = React.useState(false);

  const { show } = useToast();

  useEffect(() => {
    fetchStatus();
    fetchRoom();
    fetchBestFriendStatus();
  }, [fetchStatus, fetchRoom, fetchBestFriendStatus, likeCount]);

  if (roomLoading || !room) {
    return <LoadingModal open={roomLoading} />;
  }

  const byType = Object.fromEntries(
    equippedItems.map((it) => [it.itemType, it])
  );
  const selectFLOOR = byType.FLOOR;
  const selectWALL = byType.WALL;
  const selectSHELF = byType.SHELF;
  const selectOBJECT = byType.OBJECT;
  const selectWINDOW = byType.WINDOW;
  const selectAPPAREL = byType.APPAREL;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* 헤더 */}
      <header
        className={`fixed top-0 left-1/2 transform -translate-x-1/2 z-50 max-w-[390px] w-full pt-[50px] pb-[20px]`}
      >
        <div className="relative flex items-center justify-center mx-auto">
          <div className="flex items-center justify-center">
            {isBestFriend && (
              <div className="w-3.5 h-3.5 rounded-full bg-sub-100 flex items-center justify-center mr-2">
                <i className="mgc_star_fill text-background text-[8px]" />
              </div>
            )}
            <h1 className="text-lg font-semibold ">{room.nickname} 님의 방</h1>
          </div>
          <div className="absolute left-[16px]">
            <BackButton />
          </div>

          <div className="absolute right-[16px] text-main-100 text-xs">
            {status.isFollowing ? (
              <button
                onClick={() => setShowUnfollowModal(true)}
                className="px-2 py-1 rounded bg-main-5 text-main-100 text-xs"
                disabled={loading}
              >
                팔로잉
              </button>
            ) : (
              <button
                onClick={() => {
                  follow();
                  show({
                    message: `${room.nickname}님을 팔로우 했어요!`,
                    variant: 'success',
                  });
                }}
                className="px-2 py-1 rounded bg-main-100 text-background text-xs"
                disabled={loading}
              >
                + 팔로우
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 캐릭터 + 배경 */}

      <div className="relative flex-1 h-screen flex justify-center items-center p-4 max-w-[390px]">
        <Link
          href={`/home/${userId}/guest-book`}
          className={`absolute top-25 right-5`}
          style={{ zIndex: 1000 }}
        >
          <div className="flex flex-col items-center space-y-1">
            <img src="/icons/mailbox.png" className="w-5 h-5" />
            <span className={`text-xs text-[#FD6161]`}>방명록</span>
          </div>
        </Link>

        {/* FLOOR */}
        <img
          src={
            manifest.items[selectFLOOR?.itemId]?.asset.src ||
            manifest.items[DEFAULT_FLOOR]?.asset.src
          }
          className={`absolute bottom-0`}
          style={{ zIndex: zIndex.FLOOR }}
        />
        {/* WALL */}
        {manifest.items[selectWALL?.itemId]?.asset.src && (
          <img
            src={manifest.items[selectWALL?.itemId]?.asset.src}
            className={`absolute top-0`}
            style={{ zIndex: zIndex.WALL }}
          />
        )}
        {/* 선반 */}
        <img
          src={
            manifest.items[selectSHELF?.itemId]?.asset.src ||
            manifest.items[DEFAULT_SHELF]?.asset.src
          }
          className={`absolute bottom-[33%] left-3`}
          style={{ zIndex: zIndex.SHELF }}
          onClick={() => router.push(`/neighbor/${room.userId}/diary`)}
        />
        {/* OBJECT */}
        {manifest.items[selectOBJECT?.itemId]?.asset.src && (
          <img
            src={manifest.items[selectOBJECT?.itemId]?.asset.src}
            className={`absolute bottom-[33%] right-2`}
            style={{ zIndex: zIndex.OBJECT }}
          />
        )}
        {/* WINDOW */}
        <div className="absolute top-37">
          <div className="relative w-[214px] h-[131px]">
            {/* 창문 */}
            <img
              src={
                manifest.items[selectWINDOW?.itemId]?.asset.src ||
                manifest.items[DEFAULT_WINDOW]?.asset.src
              }
              alt=""
              className="absolute inset-0"
              style={{ zIndex: zIndex.WINDOW }} // 기준 레이어
            />
            {/* 날씨(가운데) */}
            <img
              src={manifest.items[41]?.asset.src}
              alt=""
              className="absolute left-1/2 top-11 -translate-x-1/2"
              style={{ zIndex: zIndex.WINDOW - 1 }} // 창문 아래
            />
          </div>
        </div>

        {/* APPAREL */}
        <img
          src={
            manifest.items[selectAPPAREL?.itemId]?.asset.src ||
            manifest.items[DEFAULT_APPAREL]?.asset.src
          }
          className={`absolute bottom-[33%]`}
          style={{ zIndex: zIndex.APPAREL }}
        />
      </div>

      {/* 하단 정보 */}
      <RoomStatsCard
        today={room.viewCount}
        like={room.likeCount}
        isLiked={isLiked}
        onLike={toggleLike}
        className="fixed bottom-12 z-10"
        isMine={isMine}
      />

      {showUnfollowModal && (
        <TwoButtonModal
          title="정말 팔로우를 취소하시겠어요?"
          cancelText="아니오"
          onCancel={() => setShowUnfollowModal(false)}
          confirmText="네, 취소할래요"
          onConfirm={async () => {
            try {
              await unfollow();
              show({ message: '취소가 완료되었습니다.', variant: 'success' });
            } catch (_) {
              show({
                message: '취소에 실패했습니다. 다시 시도해주세요.',
                variant: 'danger',
              });
            } finally {
              setShowUnfollowModal(false);
            }
          }}
        />
      )}
    </div>
  );
}
