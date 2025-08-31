'use client';

import HeaderBar from './home/Header';
import RoomStatsCard from './_components/RoomStatsCard';
import useMyRoom from '@/hooks/user/useMyRoom';
import LoadingContent from './_components/LoadingContent';

export default function Home() {
  const { data, loading, error } = useMyRoom();

  if (loading)
    return (
      <LoadingContent
        loading={loading}
        className="max-w-[390px] w-screen h-screen"
      />
    );

  return (
    <>
      <HeaderBar credit={data.credit} />

      <div className="flex-1 h-full flex justify-center items-center p-4 max-w-[390px] w-screen">
        <p className="text-main">캐릭터 위치</p>
      </div>

      <RoomStatsCard
        today={data.viewCount}
        like={data.likeCount}
        className="fixed bottom-22"
      />
    </>
  );
}
