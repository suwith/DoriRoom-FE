'use client';

import HeaderBar from './home/Header';
import RoomStatsCard from './_components/RoomStatsCard';
import useMyRoom from '@/hooks/user/useMyRoom';
import LoadingContent from './_components/LoadingContent';
import manifest from '@/data/manifest.json';
import useWeather from '@/hooks/home/useWeather';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import weather from '@/data/weather.json';
import useLocationPermission from '@/hooks/location/useLocationPermission';
import useLocationWatcher from '@/hooks/location/useLocationWatcher';
import { useLocationStore } from '@/stores/useLocationStore';
import { useAuthStore } from '@/stores/useAuthStore';

const DEFAULT_FLOOR = 39;
const DEFAULT_SHELF = 38;
const DEFAULT_APPAREL = 31;
const DEFAULT_WINDOW = 40;

export default function Home() {
  const router = useRouter();
  const { data, loading, error } = useMyRoom();
  const { granted } = useLocationPermission();
  const { start, stop } = useLocationWatcher();

  const { weather: info, refetch } = useWeather();
  const location = useLocationStore((s) => s.location); // { lat, lng, ts }

  const [wallH, setWallH] = useState(0);
  const wallRef = useRef(null);

  const zIndex = manifest.defaults.zIndex;
  const equippedItems = Array.isArray(data?.equippedItems)
    ? data.equippedItems
    : [];

  const user = useAuthStore((s) => s.user);
  if (!user) router.push('/auth');

  // 권한이 허용됐을 때만 watch 시작/중지
  useEffect(() => {
    if (granted) start();
    else stop();
  }, [granted, start, stop]);

  // 좌표가 준비되면 날씨 호출 (쓰로틀은 useWeather 내부에서 처리)
  useEffect(() => {
    if (!granted) return;
    if (!Number.isFinite(location?.lat) || !Number.isFinite(location?.lng))
      return;
    refetch({ lat: location.lat, lon: location.lng });
  }, [granted, location?.lat, location?.lng, refetch]);

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

  const DEFAULT_H = selectWALL ? wallH : 520;
  return (
    <div className="h-screen w-screen overflow-y-hidden">
      <HeaderBar credit={data.credit} />

      <div className="relative flex-1 h-full w-full flex justify-center items-center">
        {/* FLOOR */}
        <img
          src={
            manifest.items[selectFLOOR?.itemId]?.asset.src ||
            manifest.items[DEFAULT_FLOOR]?.asset.src
          }
          className={`absolute w-full`}
          style={{ zIndex: zIndex.FLOOR, top: DEFAULT_H }}
        />
        {/* WALL */}
        {manifest.items[selectWALL?.itemId]?.asset.src && (
          <img
            ref={wallRef}
            src={manifest.items[selectWALL?.itemId]?.asset.src}
            className={`absolute top-0 w-full`}
            style={{ zIndex: zIndex.WALL }}
            onLoad={(e) => setWallH(e.currentTarget.clientHeight)} // 렌더된 높이
          />
        )}
        {/* 선반 */}
        <img
          src={
            manifest.items[selectSHELF?.itemId]?.asset.src ||
            manifest.items[DEFAULT_SHELF]?.asset.src
          }
          className={`absolute left-3`}
          style={{ zIndex: zIndex.SHELF, top: DEFAULT_H - 180 }}
          onClick={() => router.push('/diary')}
        />
        {/* OBJECT */}
        {manifest.items[selectOBJECT?.itemId]?.asset.src && (
          <img
            src={manifest.items[selectOBJECT?.itemId]?.asset.src}
            className={`absolute right-2`}
            style={{ zIndex: zIndex.OBJECT, top: DEFAULT_H - 44 }}
          />
        )}
        {/* WINDOW */}
        <div className="absolute" style={{ top: DEFAULT_H - 401 }}>
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
              src={weather?.[info]?.asset?.src}
              alt=""
              className="absolute left-1/2 top-11 -translate-x-1/2"
              style={{ zIndex: zIndex.WINDOW - 1 }} // 창문 아래
            />
          </div>
        </div>

        {/* APPAREL */}
        <div
          className="absolute"
          style={{ zIndex: zIndex.APPAREL, top: DEFAULT_H - 220 }}
        >
          <div className="relative">
            {/* 말풍선 이미지 */}
            <img src="/images/bubble.svg" />

            {/* 말풍선 전체를 덮는 레이어 */}
            <div className="absolute inset-0 bottom-2 flex items-center justify-center px-4">
              <p
                className={`text-justify break-words [overflow-wrap:anywhere] whitespace-pre-wrap max-w-full font-normal text-xs ${data?.speechBubble ? 'text-black' : 'text-neutral-400'}`}
              >
                {data?.speechBubble
                  ? data?.speechBubble
                  : '한줄소개를 추가해 보세요!'}{' '}
                <i
                  className="mgc_pencil_fill text-neutral-400"
                  onClick={() => router.push('/home/edit-intro')}
                />
              </p>
            </div>
          </div>

          <img
            src={
              manifest.items[selectAPPAREL?.itemId]?.asset.src ||
              manifest.items[DEFAULT_APPAREL]?.asset.src
            }
            className="-mt-8"
          />
        </div>
      </div>

      <RoomStatsCard
        today={data.viewCount}
        like={data.likeCount}
        className="fixed bottom-22 z-10"
        isMine={true}
      />
    </div>
  );
}
