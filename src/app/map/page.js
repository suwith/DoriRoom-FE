// components/BoryeongMudPolygon.tsx
'use client';
import { Map, Polygon } from 'react-kakao-maps-sdk';
import { useMemo } from 'react';

// 1) geojson.io에서 저장한 GeoJSON(Polygon) 일부 예시
// features[0].geometry.coordinates[0] => [[lng, lat], [lng, lat], ...]
const geojson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        coordinates: [
          [
            [126.51250439349849, 36.31222215751754],
            [126.51287505484402, 36.31162217592073],
            [126.51305713410216, 36.31170339640708],
            [126.51308314542456, 36.311826536982664],
            [126.51285229493635, 36.31225097747763],
            [126.51272223832467, 36.31229813738997],
            [126.51250439349849, 36.31222215751754],
          ],
        ],
        type: 'Polygon',
      },
    },
  ],
};

export default function BoryeongMudPolygon() {
  // 2) [lng, lat] -> {lat, lng} 변환
  const path = useMemo(() => {
    const ring = geojson.features[0].geometry.coordinates[0]; // 외곽 링
    return ring.map(([lng, lat]) => ({ lat, lng }));
  }, []);

  // 3) 지도 중심(대천해수욕장 부근) & 폴리곤 렌더
  return (
    <Map
      center={{ lat: 36.312, lng: 126.512 }} // 대천해수욕장 중심부 근방
      level={2}
      style={{ width: '100%', height: '100%' }}
    >
      <Polygon
        path={path}
        strokeWeight={3}
        strokeColor="#5B8DEF"
        strokeOpacity={0.9}
        fillColor="#5B8DEF"
        fillOpacity={0.25}
      />
    </Map>
  );
}
