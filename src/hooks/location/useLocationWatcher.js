'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { useLocationStore } from '@/stores/useLocationStore';

// 두 좌표 사이 거리(m)
function distanceMeters(a, b) {
  if (!a || !b) return Infinity;
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * 위치 워처 훅
 * @param {Object} opts
 * @param {boolean} opts.enabled - true일 때만 watch 시작/유지 (기본 true)
 * @param {number}  opts.distanceFilter - 이 거리(m) 미만 변화는 무시 (기본 5m)
 * @param {boolean} opts.highAccuracy - 고정밀 요청 (기본 true)
 * @param {number}  opts.timeout - 타임아웃 ms (기본 10000)
 * @param {number}  opts.maximumAge - 캐시 허용 ms (기본 10000)
 * @returns {{ start: Function, stop: Function, isWatching: boolean, lastError: any }}
 */
export default function useLocationWatcher({
  enabled = true,
  distanceFilter = 5,
  highAccuracy = true,
  timeout = 10000,
  maximumAge = 10000,
} = {}) {
  const setLocation = useLocationStore((s) => s.setLocation);

  const watchIdRef = useRef(null); // web: number, native: string
  const lastPosRef = useRef(null); // 마지막으로 반영한 좌표
  const errCountRef = useRef(0);
  const platformRef = useRef(Capacitor.getPlatform());
  const mountedRef = useRef(true);

  const [isWatching, setIsWatching] = useState(false);
  const [lastError, setLastError] = useState(null);

  const clearWatch = useCallback(() => {
    try {
      const id = watchIdRef.current;
      if (id == null) return;
      if (platformRef.current === 'web') {
        navigator.geolocation.clearWatch(id);
      } else {
        Geolocation.clearWatch({ id });
      }
    } catch (e) {
      // noop
    } finally {
      watchIdRef.current = null;
      setIsWatching(false);
      errCountRef.current = 0;
    }
  }, []);

  const start = useCallback(async () => {
    if (!mountedRef.current) return;
    if (watchIdRef.current != null) return; // 이미 실행 중

    setLastError(null);
    errCountRef.current = 0;

    const onSuccess = (pos) => {
      if (!mountedRef.current || !pos?.coords) return;
      const newCoords = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };

      // 작은 튐 무시
      const dist = distanceMeters(lastPosRef.current, newCoords);
      if (dist >= distanceFilter) {
        lastPosRef.current = newCoords;
        setLocation(newCoords); // Zustand store 업데이트
      }
    };

    const onError = (err) => {
      if (!mountedRef.current) return;
      setLastError(err);
      errCountRef.current += 1;
      // 연속 3회 에러면 워치 중단
      if (errCountRef.current >= 3) {
        clearWatch();
      }
      // 콘솔 로그는 필요 시만
      // console.error('Geolocation error:', err?.message || err);
    };

    try {
      if (platformRef.current === 'web') {
        if (!('geolocation' in navigator)) {
          throw new Error('Geolocation not supported on web.');
        }
        const id = navigator.geolocation.watchPosition(onSuccess, onError, {
          enableHighAccuracy: highAccuracy,
          timeout,
          maximumAge,
        });
        watchIdRef.current = id;
        setIsWatching(true);
      } else {
        // Capacitor (iOS/Android)
        const perm = await Geolocation.requestPermissions();
        // iOS: {location: 'granted'|'denied'|'prompt-with-rationale'...}
        // Android: { location: 'granted'|'denied' }
        const granted =
          perm?.location === 'granted' ||
          perm?.coarseLocation === 'granted' ||
          perm?.fineLocation === 'granted';
        if (!granted) throw new Error('Location permission denied.');

        const id = await Geolocation.watchPosition(
          { enableHighAccuracy: highAccuracy, timeout, maximumAge },
          (pos, err) => {
            if (err) onError(err);
            else if (pos) onSuccess(pos);
          }
        );
        // Capacitor id는 string
        watchIdRef.current = id;
        setIsWatching(true);
      }
    } catch (e) {
      setLastError(e);
      clearWatch();
    }
  }, [
    clearWatch,
    distanceFilter,
    highAccuracy,
    maximumAge,
    setLocation,
    timeout,
  ]);

  const stop = useCallback(() => {
    clearWatch();
  }, [clearWatch]);

  // enabled 변화에 따라 자동 start/stop
  useEffect(() => {
    mountedRef.current = true;
    if (enabled) start();
    else stop();

    return () => {
      mountedRef.current = false;
      stop();
    };
  }, [enabled, start, stop]);

  return { start, stop, isWatching, lastError };
}
