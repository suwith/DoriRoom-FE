'use client';

import HeaderBar from './home/Header';
import RoomStatsCard from './_components/RoomStatsCard';
import useMyRoom from '@/hooks/user/useMyRoom';
import LoadingContent from './_components/LoadingContent';
import manifest from '@/data/manifest.json';

const DEFAULT_FLOOR = 39;
const DEFAULT_SHELF = 38;
const DEFAULT_APPAREL = 31;
const DEFAULT_WINDOW = 40;

export default function Home() {
  const { data, loading, error } = useMyRoom();
  const zIndex = manifest.defaults.zIndex;
  const equippedItems = Array.isArray(data?.equippedItems)
    ? data.equippedItems
    : [];

  if (loading)
    return (
      <LoadingContent
        loading={loading}
        className="max-w-[390px] w-screen h-screen"
      />
    );

  if (error || !data) {
    return (
      <div className="max-w-[390px] w-screen h-screen flex items-center justify-center text-red-500">
        데이터를 불러오는 중 오류가 발생했습니다.
      </div>
    );
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
    <>
      <HeaderBar credit={data.credit} />

      <div className="relative flex-1 h-full flex justify-center items-center p-4 max-w-[390px] w-screen">
        {/* FLOOR */}
        <img
          src={
            manifest.items[selectFLOOR?.itemId]?.asset.src ||
            manifest.items[DEFAULT_FLOOR]?.asset.src
          }
          className={`absolute top-130`}
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
          className={`absolute top-75 left-3`}
          style={{ zIndex: zIndex.SHELF }}
        />
        {/* OBJECT */}
        {manifest.items[selectOBJECT?.itemId]?.asset.src && (
          <img
            src={manifest.items[selectOBJECT?.itemId]?.asset.src}
            className={`absolute top-109 right-2`}
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
          className={`absolute top-82`}
          style={{ zIndex: zIndex.APPAREL }}
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
