'use client';

import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { useEffect, useState } from 'react';

export default function useLocationPermission() {
  const [granted, setGranted] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('실행됨');
    const request = async () => {
      try {
        if (Capacitor.getPlatform() === 'web') {
          navigator.permissions
            .query({ name: 'geolocation' })
            .then((result) => {
              const state = result.state;
              if (state === 'granted') {
                setGranted(true);
              } else if (state === 'propmt') {
                navigator.geolocation.getCurrentPosition((pos) => {
                  return pos;
                });
                setGranted(false);
              } else {
                navigator.geolocation.getCurrentPosition((pos) => {
                  return pos;
                });
                setGranted(false);
              }
            });

          return;
        } else {
          const perm = await Geolocation.requestPermissions();
          if (perm.location === 'granted') {
            setGranted(true);
          } else {
            setGranted(false);
          }
        }
      } catch (err) {
        setGranted(false);
        setError(err);
      }
    };

    request();
  }, []);

  return { granted, error };
}
