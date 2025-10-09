'use client';

import { useState } from 'react';
import RegionSelector from './_components/RegionSelector';
import RankingList from './_components/RankingList';
import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import useRankingAll from '@/hooks/ranking/useRankingAll';
import useMyRankingAll from '@/hooks/ranking/useMyRankingAll';
import useRankingRegional from '@/hooks/ranking/useRankingRegional';
import useMyRankingRegional from '@/hooks/ranking/useMyRankingRegional';
import { useAuthStore } from '@/stores/useAuthStore';
import RankingCard from '@/app/ranking/_components/RankingCard';
import Tabs from '@/app/_components/Tabs';

export default function RankingPage() {
  const [activeTab, setActiveTab] = useState(0);
  const tabList = ['전체 랭킹', '지역 랭킹'];
  const [region, setRegion] = useState('SEOUL');
  const user = useAuthStore((s) => s.user);

  // 전체 랭킹
  const { users: allUsers, loading: allLoading } = useRankingAll();
  const { myRank: myAllRank, loading: myAllLoading } = useMyRankingAll();

  // 지역 랭킹
  const { users: regionalUsers, loading: regionalLoading } =
    useRankingRegional(region);
  const { myRank: myRegionalRank, loading: myRegionalLoading } =
    useMyRankingRegional(region);

  const isRegional = activeTab === 1;

  return (
    <div className="w-screen layout-padding-t">
      <HeaderNavigationBar
        title="랭킹"
        type="ranking"
        className="bg-background"
      />

      {/* 탭 */}
      <Tabs
        tabs={tabList}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        type="festival"
      />

      <div className="p-4">
        {/* 지역 선택 */}
        {isRegional && <RegionSelector region={region} setRegion={setRegion} />}

        {/* 내 랭킹 */}
        {!isRegional && !myAllLoading && myAllRank && (
          <RankingCard key={user.userId} user={myAllRank} isMy />
        )}
        {isRegional && !myRegionalLoading && myRegionalRank && (
          <RankingCard key={user.userId} user={myRegionalRank} isMy />
        )}

        {/* 랭킹 리스트 */}
        {!isRegional && !allLoading && <RankingList users={allUsers} />}
        {isRegional && !regionalLoading && (
          <RankingList users={regionalUsers} />
        )}
      </div>
    </div>
  );
}
