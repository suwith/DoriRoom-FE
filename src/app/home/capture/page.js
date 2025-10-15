'use client';

import React, { useEffect, useRef, useState } from 'react';
import domtoimage from 'dom-to-image-more';
import { useRouter } from 'next/navigation';
import manifest from '@/data/manifest.json';
import useMyRoom from '@/hooks/user/useMyRoom';
import useWeather from '@/hooks/home/useWeather';
import weather from '@/data/weather.json';
import LoadingContent from '@/app/_components/LoadingContent';
import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import useLocationPermission from '@/hooks/location/useLocationPermission';
import useLocationWatcher from '@/hooks/location/useLocationWatcher';
import { useLocationStore } from '@/stores/useLocationStore';
import { useAuthStore } from '@/stores/useAuthStore';

const DEFAULT_FLOOR = 39;
const DEFAULT_SHELF = 38;
const DEFAULT_APPAREL = 31;
const DEFAULT_WINDOW = 40;

export default function CapturePage() {
  const [capturedImg, setCapturedImg] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(true);
  const captureRef = useRef(null);
  const wallRef = useRef(null);
  const [wallH, setWallH] = useState(0);
  const router = useRouter();
  const { granted } = useLocationPermission();
  const { start, stop } = useLocationWatcher();

  const { data, loading, error } = useMyRoom();
  const { weather: info, refetch } = useWeather();
  const location = useLocationStore((s) => s.location);
  const user = useAuthStore((s) => s.user);
  if (!user) router.push('/auth');

  const equippedItems = Array.isArray(data?.equippedItems)
    ? data.equippedItems
    : [];

  const byType = Object.fromEntries(
    equippedItems.map((it) => [it.itemType, it])
  );
  const selectFLOOR = byType.FLOOR;
  const selectWALL = byType.WALL;
  const selectSHELF = byType.SHELF;
  const selectOBJECT = byType.OBJECT;
  const selectWINDOW = byType.WINDOW;
  const selectAPPAREL = byType.APPAREL;

  const DEFAULT_H = selectWALL ? wallH : 420;
  const zIndex = manifest.defaults.zIndex;

  useEffect(() => {
    if (granted) start();
    else stop();
  }, [granted, start, stop]);

  useEffect(() => {
    if (!granted) return;
    if (!Number.isFinite(location?.lat) || !Number.isFinite(location?.lng))
      return;
    refetch({ lat: location.lat, lon: location.lng });
  }, [granted, location?.lat, location?.lng, refetch]);

  if (loading)
    return <LoadingContent loading={true} className="w-screen h-screen" />;

  if (error || !data)
    return (
      <div className="w-screen h-screen flex items-center justify-center text-red-500">
        데이터를 불러오는 중 오류가 발생했습니다.
      </div>
    );

  const handleCapture = async () => {
    try {
      await new Promise((r) => setTimeout(r, 100)); // 렌더 안정화 대기
      const node = captureRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();

      // 위 40px, 아래 40px 잘라내기
      const clip = {
        x: 0,
        y: 40,
        width: rect.width,
        height: rect.height - 80,
      };

      const dataUrl = await domtoimage.toPng(node, {
        bgcolor: '#ffffff',
        quality: 1,
        cacheBust: true,
        clip, // ← 바로 적용
        style: {
          border: 'none',
          outline: 'none',
          boxShadow: 'none',
        },
      });

      setCapturedImg(dataUrl);
      setIsModalOpen(true);
    } catch (err) {
      console.error('캡쳐 실패:', err);
      alert('화면을 캡쳐할 수 없습니다. 다시 시도해주세요.');
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = capturedImg;
    link.download = 'doriroom.png';
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      const blob = await (await fetch(capturedImg)).blob();
      const file = new File([blob], 'doriroom.png', { type: 'image/png' });
      try {
        await navigator.share({
          files: [file],
          title: '도리룸 내 방 촬영',
          text: '내 도리룸을 구경해보세요!',
        });
      } catch (err) {
        console.log('공유 취소 또는 실패', err);
      }
    } else {
      handleDownload();
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* 헤더 */}
      <HeaderNavigationBar title="촬영" className="bg-background" />

      {/* 촬영 대상 (방 전체) */}
      <div
        ref={captureRef}
        className="relative flex-1 h-full w-full flex justify-center items-center"
      >
        {/* FLOOR */}
        <img
          src={
            manifest.items[selectFLOOR?.itemId]?.asset.src ||
            manifest.items[DEFAULT_FLOOR]?.asset.src
          }
          className="absolute w-full"
          style={{ zIndex: zIndex.FLOOR, top: DEFAULT_H }}
        />

        {/* WALL */}
        {manifest.items[selectWALL?.itemId]?.asset.src && (
          <img
            ref={wallRef}
            src={manifest.items[selectWALL?.itemId]?.asset.src}
            className="absolute top-0 w-full"
            style={{ zIndex: zIndex.WALL }}
            onLoad={(e) => setWallH(e.currentTarget.clientHeight)}
          />
        )}

        {/* 선반 */}
        <img
          src={
            manifest.items[selectSHELF?.itemId]?.asset.src ||
            manifest.items[DEFAULT_SHELF]?.asset.src
          }
          className="absolute left-3"
          style={{ zIndex: zIndex.SHELF, top: DEFAULT_H - 180 }}
        />

        {/* OBJECT */}
        {manifest.items[selectOBJECT?.itemId]?.asset.src && (
          <img
            src={manifest.items[selectOBJECT?.itemId]?.asset.src}
            className="absolute right-2"
            style={{ zIndex: zIndex.OBJECT, top: DEFAULT_H - 44 }}
          />
        )}

        {/* WINDOW */}
        <div className="absolute" style={{ top: DEFAULT_H - 401 }}>
          <div className="relative w-[214px] h-[131px]">
            <img
              src={
                manifest.items[selectWINDOW?.itemId]?.asset.src ||
                manifest.items[DEFAULT_WINDOW]?.asset.src
              }
              alt=""
              className="absolute inset-0"
              style={{ zIndex: zIndex.WINDOW }}
            />
            <img
              src={weather?.[info]?.asset?.src}
              alt=""
              className="absolute left-1/2 top-11 -translate-x-1/2"
              style={{ zIndex: zIndex.WINDOW - 1 }}
            />
          </div>
        </div>

        {/* 캐릭터 */}
        <div
          className="absolute"
          style={{ zIndex: zIndex.APPAREL, top: DEFAULT_H - 125 }}
        >
          <img
            src={
              manifest.items[selectAPPAREL?.itemId]?.asset.src ||
              manifest.items[DEFAULT_APPAREL]?.asset.src
            }
            className="-mt-8"
          />
        </div>
      </div>

      {/* 촬영 버튼 */}
      <div className="flex flex-col gap-2 justify-center items-center bottom-0 left-[50%] w-full z-1 ">
        {isAlertOpen && (
          <p className="text-sm rounded-full py-2 px-4 mt-4 mb-3 bg-sub2-5 text-sub2-100">
            촬영 버튼을 눌러 내 방을 사진으로 남겨보세요!
            <i
              className="mgc_close_line text-sm pl-1"
              onClick={() => setIsAlertOpen(false)}
            />
          </p>
        )}
        <div className="flex items-center justify-center w-full px-10 bg-background pt-5 pb-14 rounded-t-[10px]">
          <button
            onClick={handleCapture}
            className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-b from-green-100 to-emerald-200 border-4 border-white shadow-lg active:scale-95 transition"
          >
            <div className="relative w-14 h-14 rounded-full bg-background border-white shadow-lg active:scale-95 transition" />
          </button>
        </div>
      </div>

      {/* 사진 보기 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-100">
          <div className="bg-background rounded-2xl p-4 w-[85%] max-w-sm shadow-lg relative">
            <p className="text-center font-semibold mb-3">사진 보기</p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-main-5 text-main-100 rounded-full w-5 h-5 p-1 text-xs absolute top-4 right-4 "
            >
              <i className="mgc_close_line" />
            </button>
            <div className="rounded-lg overflow-hidden mb-4">
              <img src={capturedImg} alt="캡쳐" className="object-contain" />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setCapturedImg(null);
                }}
                className="flex-1 py-2 text-main-100 bg-main-5 rounded-lg font-medium"
              >
                다시 촬영하기
              </button>
              <button
                onClick={handleShare}
                className="flex-1 py-2 bg-main-100 text-background rounded-lg font-medium"
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
