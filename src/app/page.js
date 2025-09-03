'use client';

import HeaderBar from './home/Header';
import RoomStatsCard from './_components/RoomStatsCard';
import useMyRoom from '@/hooks/user/useMyRoom';
import LoadingContent from './_components/LoadingContent';
import manifest from '../../public/manifest.json' assert { type: 'json' };

export default function Home() {
  const { data, loading, error } = useMyRoom();
  const zIndex = manifest.defaults.zIndex;
  if (loading)
    return (
      <LoadingContent
        loading={loading}
        className="max-w-[390px] w-screen h-screen"
      />
    );

  console.log(manifest.items[1].asset.src);

  return (
    <>
      <HeaderBar credit={data.credit} />

      <div className="relative flex-1 h-full flex justify-center items-center p-4 max-w-[390px] w-screen">
        <p className="text-main">캐릭터 위치</p>
        {/* FLOOR */}
        <img
          src={`/images${manifest.items[19].asset.src}`}
          className={`absolute top-130 z-${zIndex.FLOOR}`}
        />
        {/* WALL */}
        <img
          src={`/images${manifest.items[25].asset.src}`}
          className={`absolute top-0 z-${zIndex.WALL}`}
        />
        {/* <img src="/character.png" /> */}
        {/* 선반 */}
        <img
          src={`/images${manifest.items[1].asset.src}`}
          className={`absolute top-75 left-3 z-${zIndex.SHELF}`}
        />
        {/* OBJECT */}
        <img
          src={`/images${manifest.items[7].asset.src}`}
          className={`absolute top-109 right-2 z-${zIndex.OBJECT}`}
        />
        {/* WINDOW */}
        <img
          src={`/images${manifest.items[13].asset.src}`}
          className={`absolute top-37 z-${zIndex.WINDOW}`}
        />
        {/* APPAREL */}
        <img
          src={`/images${manifest.items[31].asset.src}`}
          className={`absolute top-82 z-${zIndex.APPAREL}`}
        />
      </div>

      <RoomStatsCard
        today={data.viewCount}
        like={data.likeCount}
        className="fixed bottom-22 z-10"
      />
    </>
  );
}
