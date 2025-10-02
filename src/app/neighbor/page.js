'use client';

import { useState } from 'react';
import useFollowers from '@/hooks/follow/useFollowers';
import useFollowings from '@/hooks/follow/useFollowings';
import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import NeighborListItem from '@/app/neighbor/_components/NeighborListItem';
import NeighborSearchBar from '@/app/neighbor/_components/NeighborSearchBar';
import LoadingContent from '@/app/_components/LoadingContent';
import Tabs from '@/app/_components/Tabs';

export default function NeighborPage() {
  const [activeTab, setActiveTab] = useState(0);

  const tabList = ['팔로워', '팔로잉'];
  const {
    followers,
    loading: followersLoading,
    refetch: refetchFollowers,
  } = useFollowers({});
  const {
    followings,
    loading: followingsLoading,
    refetch: refetchFollowings,
  } = useFollowings({});
  const [search, setSearch] = useState('');

  const currentList = activeTab === 0 ? followers : followings;
  const loading = activeTab === 1 ? followersLoading : followingsLoading;

  const filteredList = currentList.filter((u) =>
    u.nickname.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col w-screen header-padding-tb bg-background">
      <HeaderNavigationBar
        title={'이웃'}
        showBackButton={true}
        className="bg-background"
        type="neighbor"
      />

      {/* 검색 */}
      <NeighborSearchBar onSearch={setSearch} />

      {/* 탭 */}
      <Tabs tabs={tabList} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 리스트 */}
      <div className="flex-1 overflow-y-auto px-4">
        {loading ? (
          <LoadingContent loading={loading} />
        ) : (
          <ul className="flex flex-col">
            <div className="text-sm mb-2 mt-2">
              {activeTab === 1
                ? `팔로잉 ${followings.length}명`
                : `팔로워 ${followers.length}명`}
            </div>
            <div className="space-y-1">
              {filteredList.map((n) => (
                <NeighborListItem
                  key={n.userId}
                  user={n}
                  mode={activeTab}
                  onFollowChange={() => {
                    refetchFollowers();
                    refetchFollowings();
                  }}
                />
              ))}
            </div>
          </ul>
        )}
      </div>
    </div>
  );
}
