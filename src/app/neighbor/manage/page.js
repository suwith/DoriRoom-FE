'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useFollowings from '@/hooks/follow/useFollowings';
import useBestFriend from '@/hooks/follow/useBestFriend';
import NeighborListItem from '@/app/neighbor/_components/NeighborListItem';
import BackButton from '@/app/_components/BackButton';
import LoadingContent from '@/app/_components/LoadingContent';
import { useToast } from '@/app/_providers/ToastProvider';

export default function NeighborManagePage() {
  const { followings, loading } = useFollowings({});
  const { toggleBestFriend } = useBestFriend();
  const [selected, setSelected] = useState({});
  const router = useRouter();
  const { show } = useToast();

  // 초기값: 팔로잉 목록 불러올 때 단짝 여부 반영
  useEffect(() => {
    if (followings.length > 0) {
      const init = {};
      followings.forEach((f) => {
        init[f.userId] = f.isBestFriend;
      });
      setSelected(init);
    }
  }, [followings]);

  // 체크 토글 (API 호출 없이 로컬 상태만 변경)
  const handleToggle = (userId, checked) => {
    setSelected((prev) => ({ ...prev, [userId]: checked }));
  };

  // 모두 지우기 → 로컬 상태만 false
  const handleClearAll = () => {
    const cleared = {};
    followings.forEach((f) => {
      cleared[f.userId] = false;
    });
    setSelected(cleared);
  };

  // 수정 완료 → 최종 상태를 서버에 반영
  const handleSave = async () => {
    const updates = followings.map((f) =>
      toggleBestFriend(f.userId, !!selected[f.userId])
    );
    await Promise.all(updates);
    show({ message: '단짝 도리 목록이 수정되었어요!', variant: 'success' });
    router.back();
  };

  if (loading) return <LoadingContent loading={loading} />;

  return (
    <div className="min-h-screen flex flex-col bg-background w-screen header-padding-tb">
      {/* 헤더 */}
      <header
        className={`fixed top-0 left-1/2 transform -translate-x-1/2 z-50 w-screen header-padding-t bg-background pb-[20px]`}
      >
        <div className="relative flex items-center justify-center mx-auto">
          <h1 className="text-xl font-semibold text-gray-800">
            단짝 도리 관리
          </h1>

          <div className="absolute left-[16px]">
            <BackButton />
          </div>

          <button
            onClick={handleClearAll}
            className="absolute right-[16px] text-main-100 text-xs"
          >
            모두 지우기
          </button>
        </div>
      </header>

      {/* 리스트 */}
      <div className="flex-1 overflow-y-auto px-4">
        <p className="text-sm text-gray-600 mb-2">
          팔로잉 {followings.length}명
        </p>
        <ul className="space-y-1">
          {followings.map((n) => (
            <NeighborListItem
              key={n.userId}
              user={n}
              checked={selected[n.userId] || false}
              onToggle={handleToggle}
              mode="manage"
            />
          ))}
        </ul>
      </div>

      {/* 하단 버튼 */}
      <div className="w-[95%] bg-background fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 flex justify-center gap-4 btn-fixed-b">
        <button
          onClick={handleSave}
          className="w-full py-3 bg-main-100 text-background rounded-lg font-semibold"
        >
          수정 완료
        </button>
      </div>
    </div>
  );
}
