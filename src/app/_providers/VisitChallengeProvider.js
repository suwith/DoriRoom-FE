'use client';

import { useEffect, useState } from 'react';
import { useVisitChallengeStore } from '@/stores/useVisitChallengeStore';
import { useLocationStore } from '@/stores/useLocationStore';
import { point, polygon as turfPolygon } from '@turf/helpers';
import useChallengesComplete from '@/hooks/collection/useChallengesComplete';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';

export default function VisitChallengeProvider() {
  const { session, setEnteredAt, stop, setElapsed } = useVisitChallengeStore();
  const { mutate } = useChallengesComplete({
    onSuccess: () => {
      markCompleted({
        challengeId: session.challengeId,
        regionId: session.regionId,
      });
      stop();
    },
  });
  const location = useLocationStore((s) => s.location);

  const [hydrated, setHydrated] = useState(
    useVisitChallengeStore.persist.hasHydrated()
  );

  useEffect(() => {
    const unsub = useVisitChallengeStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!session.active || !session.polygon) return;

    let raf = 0;
    let t;

    const tick = () => {
      const { polygon, enteredAt, requiredMs, challengeId } = session;
      if (!polygon || !challengeId) return;

      const lng = Number(location?.lng);
      const lat = Number(location?.lat);
      const locReady = Number.isFinite(lng) && Number.isFinite(lat);

      // 🔹 위치가 아직 준비 안 됐으면 "판정/리셋 금지"
      if (!locReady) {
        t = window.setTimeout(() => (raf = requestAnimationFrame(tick)), 1000);
        return;
      }

      if (Number.isFinite(lng) && Number.isFinite(lat)) {
        const inside = booleanPointInPolygon(
          point([lng, lat]),
          turfPolygon([polygon]),
          { ignoreBoundary: false }
        );

        if (inside) {
          if (!enteredAt) {
            setEnteredAt(Date.now()); // 연속 측정 시작
            setElapsed(0);
          } else {
            const elapsed = Date.now() - enteredAt;
            console.log(requiredMs);
            setElapsed(elapsed);
            if (elapsed >= requiredMs) {
              mutate({ challengeId });
              return;
            }
          }
        } else {
          // 연속 모드: 영역을 벗어나면 타이머 초기화
          if (enteredAt) setEnteredAt(null);
          if (session.elapsedMs !== 0) setElapsed(0);
        }
      }

      t = window.setTimeout(() => {
        raf = requestAnimationFrame(tick);
      }, 1000);
    };

    tick();
    return () => {
      if (t) clearTimeout(t);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [
    hydrated,
    session.active,
    session.polygon,
    session.enteredAt,
    session.requiredMs,
    session.challengeId,
    location?.lng,
    location?.lat,
    setElapsed,
    setEnteredAt,
    stop,
  ]);

  return null;
}
