'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import useFollow from '@/hooks/follow/useFollow';
import useNeighborRoom from '@/hooks/follow/useNeighborRoom';
import BackButton from '@/app/_components/BackButton';
import LoadingModal from '@/app/_components/LoadingModal';

export default function NeighborHome() {
  const params = useParams();
  const userId = params.userId;

  const { status, follow, unfollow, toggleBestFriend, fetchStatus, loading } =
    useFollow(userId);
  const { room, fetchRoom, loading: roomLoading } = useNeighborRoom(userId);

  useEffect(() => {
    fetchStatus();
    fetchRoom();
  }, [fetchStatus, fetchRoom]);

  if (roomLoading || !room) {
    return <LoadingModal open={roomLoading} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background pt-20">
      {/* 헤더 */}
      <header
        className={`fixed top-0 left-1/2 transform -translate-x-1/2 z-50 max-w-[390px] w-full pt-[50px] pb-[20px]`}
      >
        <div className="relative flex items-center justify-center mx-auto">
          <h1 className="text-xl font-semibold ">{room.nickname} 님의 방</h1>

          <div className="absolute left-[16px]">
            <BackButton />
          </div>

          <div className="absolute right-[16px] text-main-100 text-xs">
            {status.isFollowing ? (
              <button
                onClick={unfollow}
                className="px-2 py-1 rounded bg-main-5 text-main-100 text-xs"
                disabled={loading}
              >
                팔로잉
              </button>
            ) : (
              <button
                onClick={follow}
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
      <div className="flex-1 flex flex-col items-center justify-center pt-[60px]">
        <img src="/character.png" alt="캐릭터" className="w-36 h-36" />
      </div>

      {/* 하단 정보 */}
      <div className="flex justify-center gap-3 px-4 py-4">
        <div className="flex items-center gap-1 px-3 py-2 bg-background rounded-lg border text-sm font-medium">
          <i className="mgc_gift_fill text-green-500" />
          투데이 {room.viewCount ?? 0}
        </div>
        <div className="flex items-center gap-1 px-3 py-2 bg-background rounded-lg border text-sm font-medium">
          <i className="mgc_thumb_up_fill text-yellow-500" />
          좋아요 {room.likeCount ?? 0}
        </div>
      </div>
    </div>
  );
}
