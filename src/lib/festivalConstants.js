// 카테고리 한글 → 코드 매핑
export const CATEGORY_NAME_TO_CODE = {
  문화관광축제: 'EV010100',
  문화예술축제: 'EV010200',
  지역특산물축제: 'EV010300',
  전통역사축제: 'EV010400',
  생태자연축제: 'EV010500',
  기타축제: 'EV010600',
  공연: 'EV02',
  행사: 'EV03',
};

// 날짜 포맷: YYYY-MM-DD
export function formatDateYYYYMMDD(d) {
  if (!d) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// 동일한 areaCode/sigunguCode 조합 중복 제거
export function dedupLocations(locs) {
  const seen = new Set();
  const out = [];
  for (const l of locs) {
    const key = `${l.areaGroupCode}-${l.areaCode}-${l.sigunguCode ?? 'ALL'}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(l);
  }
  return out;
}

// UI용 선택값을 API 전송용으로 변환
// - 그룹에 시/도가 1개(서울, 강원, 제주): 도 전체(0,null) → areaCode = areaGroupCode, sigungu = null
// - 그룹에 시/도가 여러 개: 도 전체(0,null) → areaCode = null, sigungu = null
export function toApiLocation(l) {
  const areaGroupCode = Number(l.areaGroupCode);
  const isGroupAll =
    (l.areaCode === 0 || l.areaCode == null) && l.sigunguCode == null;

  if (isGroupAll) {
    return {
      areaGroupCode,
      areaCode: null,
      sigunguCode: null,
    };
  }

  return {
    areaGroupCode,
    areaCode: l.areaCode == null ? null : Number(l.areaCode),
    sigunguCode: l.sigunguCode == null ? null : Number(l.sigunguCode),
  };
}

// imageUrls 안전 파싱
export function parseImageUrls(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try {
    const s = String(raw).replace(/'/g, '"').replace(/\s/g, '');
    const arr = JSON.parse(s);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

// 날짜 파싱 안전 함수
export function parseDateString(dateStr) {
  if (!dateStr) return null;
  const normalized = dateStr.replace(/\./g, '-');
  const parts = normalized.split('-');
  if (parts.length !== 3) return null;
  const [y, m, d] = parts.map((n) => parseInt(n, 10));
  return new Date(y, m - 1, d);
}
