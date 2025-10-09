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
import MyRankingCard from '@/app/ranking/_components/MyRankingCard';
import Tabs from '@/app/_components/Tabs';

export default function RankingPage() {
  const [activeTab, setActiveTab] = useState(0);
  const tabList = ['전체 랭킹', '지역 랭킹'];
  const [region, setRegion] = useState('SEOUL');
  const user = useAuthStore((s) => s.user);

  const [isBottomOpen, setIsBottomOpen] = useState(true);

  // 전체 랭킹
  const { users: allUsers, loading: allLoading } = useRankingAll();
  const { myRank: myAllRank, loading: myAllLoading } = useMyRankingAll();

  // 지역 랭킹
  const { users: regionalUsers, loading: regionalLoading } =
    useRankingRegional(region);
  const { myRank: myRegionalRank, loading: myRegionalLoading } =
    useMyRankingRegional(region);

  const isRegional = activeTab === 1;

  // 현재 탭에 따른 내 랭킹 데이터
  const currentMyRank = isRegional ? myRegionalRank : myAllRank;
  const currentMyLoading = isRegional ? myRegionalLoading : myAllLoading;

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

        {/* 랭킹 리스트 */}
        {!isRegional && !allLoading && <RankingList users={allUsers} />}
        {isRegional && !regionalLoading && (
          <RankingList users={regionalUsers} />
        )}

        {/* 내 랭킹 바텀시트 */}
        {!currentMyLoading && currentMyRank && (
          <div
            className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 w-screen mx-auto z-30 rounded-t-xl px-4 pt-4 appbar-padding-b bg-background shadow-[0_-4px_12px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out ${
              isBottomOpen ? 'translate-y-0' : 'translate-y-[85%]'
            }`}
          >
            <button
              type="button"
              className="w-20 h-1 bg-neutral-200 rounded-full mx-auto mb-3 block"
              onClick={() => setIsBottomOpen((v) => !v)}
              aria-label="내 랭킹 패널 열기/닫기"
            />
            <MyRankingCard key={user.userId} user={currentMyRank} isMy />
          </div>
        )}
      </div>
    </div>
  );
}
