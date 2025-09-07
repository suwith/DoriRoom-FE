'use client';

import { useEffect } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { useLocationStore } from '@/stores/useLocationStore';

export default function useLocationWatcher() {
  const setLocation = useLocationStore((state) => state.setLocation);

  useEffect(() => {
    let watchId;
    let errorCount = 0;
    if (Capacitor.getPlatform() === 'web') {
      const startWatching = () => {
        watchId = navigator.geolocation.watchPosition(
          (pos) => {
            const newCoords = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            };
            setLocation(newCoords);
          },
          (err) => {
            console.error(err.message);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      };
      startWatching();
    } else {
      const startWatching = async () => {
        await Geolocation.requestPermissions();

        watchId = Geolocation.watchPosition(
          {
            enableHighAccuracy: true, //최대한 정확한 위치 요구
            timeout: 10000, // 10초 넘게 기다리면 실패로 간주
            maximumAge: 0, // 이전에 캐싱된 위지 정보를 얼마 동안까지 허용할 것인지
          },
          (pos, err) => {
            if (err) {
              errorCount++;
              if (errorCount >= 3) {
                Geolocation.clearWatch({ id: watchId });
              }
              console.error('위치 추적 에러', err);
              return;
            }

            if (pos) {
              const newCoords = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
              };
              setLocation(newCoords);
            }
          }
        );
      };
      startWatching();
    }

    return () => {
      const platform = Capacitor.getPlatform();
      if (platform === 'web') {
        if (watchId != null) navigator.geolocation.clearWatch(watchId);
      } else if (watchId != null) {
        Geolocation.clearWatch({ id: watchId });
      }
    };
  }, [setLocation]);
}
