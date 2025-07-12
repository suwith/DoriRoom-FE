'use client';

import useLocationWatcher from '@/hooks/useLocationWatcher';
import { useLocationStore } from '@/stores/useLocationStore';
import { useEffect, useRef, useState } from 'react';

const THRESHOLD = 100; // 100미터 이내

function isWithinDistance(coord1, coord2, thresholdMeters = 100) {
  const R = 6371000; // 지구 반지름 (m)
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(coord2.lat - coord1.lat);
  const dLng = toRad(coord2.lng - coord1.lng);

  const lat1 = toRad(coord1.lat);
  const lat2 = toRad(coord2.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // 두 지점 사이 거리 (미터 단위)

  return distance <= thresholdMeters;
}

export default function Reward() {
  useLocationWatcher();
  const location = useLocationStore((state) => state.location);
  const [isExec, setIsExec] = useState(false);
  const [count, setCount] = useState(0);
  const [active, setActive] = useState(false);
  const [targetLocation, setTargetLocation] = useState({
    lat: 37.60769951599087,
    lng: 126.9993895958719,
  });
  const intervalRef = useRef(null);

  const useLocationWatcherHook = () => {
    setIsExec(true);
  };

  const changeTargetLocation = () => {
    setTargetLocation({
      lat: 0,
      lng: 0,
    });
  };

  // 위치 변경에 따라 범위 안/밖 감지
  useEffect(() => {
    if (!isExec) return;

    const withinRange =
      typeof location.lat === 'number' && typeof location.lng === 'number'
        ? isWithinDistance(location, targetLocation, THRESHOLD)
        : false;

    setActive(withinRange);
  }, [location, isExec, targetLocation]);

  // active 상태 변화에 따라 타이머 관리
  useEffect(() => {
    if (active) {
      intervalRef.current = setInterval(() => {
        setCount((prev) => prev + 1);
        if (count >= 10) {
          console.log('리워드 지급');
          clearInterval(intervalRef.current);
          setCount(0);
          setActive(false);
        }
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
      setCount(0);
    }
    return () => clearInterval(intervalRef.current);
  }, [active, count]);

  return (
    <div className="text-black h-full flex flex-col justify-center items-center">
      <button
        className="border-1 w-20 h-15 hover:bg-sky-700"
        onClick={useLocationWatcherHook}
      >
        도전
      </button>
      <button
        className="border-1 w-20 h-15 hover:bg-sky-700"
        onClick={changeTargetLocation}
      >
        좌표 변경
      </button>
      <div>
        {isExec ? (
          <div>
            <p className="text-center">
              lat : {location.lat} lng : {location.lng}
            </p>
            <p className="text-center">타이머 : {count}</p>
            <p className="text-center">
              {active ? '범위 안입니다.' : '범위 밖입니다.'}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
