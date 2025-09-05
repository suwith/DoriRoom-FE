'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useFollowers from '@/hooks/follow/useFollowers';
import useFollowings from '@/hooks/follow/useFollowings';
import axiosInstance from '@/lib/axiosInstance';
import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import NeighborListItem from '@/app/neighbor/_components/NeighborListItem';
import NeighborSearchBar from '@/app/neighbor/_components/NeighborSearchBar';

export default function NeighborPage() {
  const [tab, setTab] = useState('followers');
  const { followers, loading: followersLoading } = useFollowers({});
  const { followings, loading: followingsLoading } = useFollowings({});
  const [removing, setRemoving] = useState(null);
  const router = useRouter();

  const currentList = tab === 'followers' ? followers : followings;
  const loading = tab === 'followers' ? followersLoading : followingsLoading;

  const handleUnfollow = async (e, userId) => {
    e.stopPropagation();
    if (!confirm('정말 언팔로우하시겠습니까?')) return;

    try {
      setRemoving(userId);
      await axiosInstance.delete(`/api/follows/${userId}`);
      // 화면 갱신을 위해 새로 불러오기
      window.location.reload();
    } catch (err) {
      console.error('언팔로우 실패:', err);
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <HeaderNavigationBar
        title={'이웃'}
        showBackButton={true}
        className="bg-background"
        type="neighbor"
      />

      {/* 탭 */}
      <div className="flex my-4 text-sm">
        <button
          onClick={() => setTab('followers')}
          className={`flex-1 py-2 text-center ${
            tab === 'followers'
              ? 'border-b-2 border-main-100 text-main-100 font-semibold'
              : 'text-gray-400'
          }`}
        >
          팔로워
        </button>
        <button
          onClick={() => setTab('followings')}
          className={`flex-1 py-2 text-center ${
            tab === 'followings'
              ? 'border-b-2 border-main-100 text-main-100 font-semibold'
              : 'text-gray-400'
          }`}
        >
          팔로잉
        </button>
      </div>

      <NeighborSearchBar />

      <div className="flex-1 overflow-y-auto px-4">
        {loading ? (
          <div className="text-center py-6 text-gray-400">불러오는 중...</div>
        ) : (
          <ul className="divide-y">
            {currentList.map((n) => (
              <NeighborListItem
                key={n.userId}
                user={n}
                onUnfollow={handleUnfollow}
                mode={tab}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
