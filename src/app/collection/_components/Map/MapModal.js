'use client';

import { createPortal } from 'react-dom';
import { FaXmark } from 'react-icons/fa6';
import { Map as KakaoMap, Polygon, MapMarker } from 'react-kakao-maps-sdk';
import { useMemo, useEffect, useState } from 'react';
import { useLocationStore } from '@/stores/useLocationStore';

function polygonCentroid(points) {
  // points: [{lat, lng}, ...] (시계/반시계 상관없음)
  let area2 = 0; // 2*A (부호 포함)
  let cx = 0;
  let cy = 0;
  const n = points.length;

  for (let i = 0; i < n; i++) {
    const { lng: x0, lat: y0 } = points[i];
    const { lng: x1, lat: y1 } = points[(i + 1) % n];
    const cross = x0 * y1 - x1 * y0; // (xi * yi+1 - xi+1 * yi)
    area2 += cross;
    cx += (x0 + x1) * cross;
    cy += (y0 + y1) * cross;
  }

  // 면적이 너무 작거나(선형/한 점) 수치적으로 불안정하면 평균값으로 폴백
  if (Math.abs(area2) < 1e-12) {
    const avg = points.reduce(
      (acc, p) => ({ lat: acc.lat + p.lat / n, lng: acc.lng + p.lng / n }),
      { lat: 0, lng: 0 }
    );
    return avg;
  }

  // Cx = (1 / (3 * area2)) * cx,  Cy = (1 / (3 * area2)) * cy  (area2 = 2A)
  // == 1 / (6A)와 동일. 부호는 방향(시계/반시계)에 따라 바뀌지만 결과는 올바르게 나옵니다.
  return { lat: cy / (3 * area2), lng: cx / (3 * area2) };
}

// 두 위경도 점 사이 거리(m)
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = (v) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function bboxLevel(path) {
  let minLat = Infinity,
    minLng = Infinity,
    maxLat = -Infinity,
    maxLng = -Infinity;
  for (const p of path) {
    if (p.lat < minLat) minLat = p.lat;
    if (p.lat > maxLat) maxLat = p.lat;
    if (p.lng < minLng) minLng = p.lng;
    if (p.lng > maxLng) maxLng = p.lng;
  }
  // 대각선 길이(m)
  const diag = haversine(minLat, minLng, maxLat, maxLng);

  // Kakao는 level 숫자가 클수록 멀리(줌 아웃)입니다.
  // 화면 크기에 따라 달라지므로, 대략적인 가이드 테이블(필요시 조정):
  if (diag < 500) return 3;
  if (diag < 1000) return 4;
  if (diag < 2000) return 5;
  if (diag < 5000) return 6;
  if (diag < 10000) return 7;
  if (diag < 20000) return 8;
  if (diag < 40000) return 9;
  if (diag < 80000) return 10;
  return 11; // 더 크면 더 멀리
}

export default function MapModal({ isOpen, setIsOpen, coordinates }) {
  const [portalElement, setPortalElement] = useState(null);
  const location = useLocationStore((state) => state.location);

  useEffect(() => {
    // 'main'이 없으면 body로 폴백
    const el = document.getElementById('main') ?? document.body;
    setPortalElement(el);
  }, []);

  const path = useMemo(() => {
    const ring = coordinates; // 외곽 링
    return ring.map(([lng, lat]) => ({ lat, lng }));
  }, [coordinates]);

  // 폴리곤 중심
  const center = useMemo(() => polygonCentroid(path), [path]);

  // 레벨
  const level = useMemo(() => bboxLevel(path), [path]);

  // 포털 대상이 준비되기 전에는 렌더하지 않음
  if (!isOpen || !portalElement) return null;

  return createPortal(
    <div className="max-w-[390px] w-full fixed top-0 bottom-0 bg-black/50 flex justify-center items-center z-50">
      <div className="flex flex-col items-center bg-background p-5 rounded-lg w-[90%]">
        <div className="flex items-center justify-between w-full mb-5">
          <div className="w-[13px]"></div>
          <span className="text-neutral-900 font-normal font-semibold text-lg">
            위치 보기
          </span>
          <div
            className="bg-main-5 rounded-full p-1"
            onClick={() => setIsOpen(false)}
          >
            <FaXmark size={13} className="font-bold text-main-100" />
          </div>
        </div>
        <KakaoMap
          center={center}
          level={level}
          style={{ width: '100%', height: '400px' }}
        >
          <Polygon
            path={path}
            strokeWeight={3}
            strokeColor="#5B8DEF"
            strokeOpacity={0.9}
            fillColor="#5B8DEF"
            fillOpacity={0.25}
          />
          <MapMarker clickable={false} draggable={false} position={location} />
        </KakaoMap>
      </div>
    </div>,
    portalElement
  );
}
