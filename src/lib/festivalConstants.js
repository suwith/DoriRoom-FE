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
