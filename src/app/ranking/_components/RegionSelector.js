'use client';

export default function RegionSelector({ region, setRegion }) {
  const regions = [
    { label: '서울', value: 'SEOUL' },
    { label: '경기', value: 'GYEONGGI' },
    { label: '강원', value: 'GANGWON' },
    { label: '충청', value: 'CHUNGNAM' },
    { label: '경상', value: 'GYEONGSANG' },
    { label: '전라', value: 'JEOLLA' },
    { label: '제주', value: 'JEJU' },
  ];

  return (
    <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
      {regions.map((r) => (
        <button
          key={r.value}
          onClick={() => setRegion(r.value)}
          className={`px-3 py-1 whitespace-nowrap rounded-full text-sm ${
            region === r.value
              ? 'bg-main-100 text-background'
              : 'bg-main-5 text-main-100'
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
