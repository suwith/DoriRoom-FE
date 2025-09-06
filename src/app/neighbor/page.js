'use client';

import { useState } from 'react';
import useFollowers from '@/hooks/follow/useFollowers';
import useFollowings from '@/hooks/follow/useFollowings';
import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import NeighborListItem from '@/app/neighbor/_components/NeighborListItem';
import NeighborSearchBar from '@/app/neighbor/_components/NeighborSearchBar';
import LoadingContent from '@/app/_components/LoadingContent';
import clsx from 'clsx';

export default function NeighborPage() {
  const [tab, setTab] = useState('followers');
  const { followers, loading: followersLoading } = useFollowers({});
  const { followings, loading: followingsLoading } = useFollowings({});
  const [search, setSearch] = useState('');

  const currentList = tab === 'followers' ? followers : followings;
  const loading = tab === 'followers' ? followersLoading : followingsLoading;

  const filteredList = currentList.filter((u) =>
    u.nickname.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-20 flex flex-col pb-7">
      <HeaderNavigationBar
        title={'이웃'}
        showBackButton={true}
        className="bg-background"
        type="neighbor"
      />

      {/* 탭 */}
      <div className="flex my-4 text-sm border-b-2 border-neutral-100">
        <button
          onClick={() => setTab('followers')}
          className={clsx(
            'relative flex-1 text-sm text-center pt-3 pb-[10px]',
            tab === 'followers'
              ? 'text-main-100 font-semibold'
              : 'text-gray-400'
          )}
        >
          팔로워
          <span
            className={clsx(
              'absolute left-1/2 -bottom-0.5 -translate-x-1/2 w-[45px] h-[2px] rounded-full',
              tab === 'followers' ? 'bg-main-100' : 'bg-neutral-200'
            )}
          />
        </button>
        <button
          onClick={() => setTab('followings')}
          className={clsx(
            'relative flex-1 text-sm text-center pt-3 pb-[10px]',
            tab === 'followings'
              ? 'text-main-100 font-semibold'
              : 'text-gray-400'
          )}
        >
          {' '}
          팔로잉
          <span
            className={clsx(
              'absolute left-1/2 -bottom-0.5 -translate-x-1/2 w-[45px] h-[2px] rounded-full',
              tab === 'followings' ? 'bg-main-100' : 'bg-neutral-200'
            )}
          />
        </button>
      </div>

      {/* 검색 */}
      <NeighborSearchBar onSearch={setSearch} />

      {/* 리스트 */}
      <div className="flex-1 overflow-y-auto px-4">
        {loading ? (
          <LoadingContent loading={loading} />
        ) : (
          <ul className="flex flex-col">
            <div className="text-sm mb-2">
              {tab === 'followings'
                ? `팔로잉 ${followings.length}명`
                : `팔로워 ${followers.length}명`}
            </div>
            <div className="space-y-1">
              {filteredList.map((n) => (
                <NeighborListItem key={n.userId} user={n} mode={tab} />
              ))}
            </div>
          </ul>
        )}
      </div>
    </div>
  );
}
