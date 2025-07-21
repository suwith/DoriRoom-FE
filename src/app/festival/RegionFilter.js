const regions = [
  { name: '서울', color: 'bg-[#9DBEFF]' },
  { name: '경기도', color: 'bg-[#CAD8FF]' },
  { name: '강원도', color: 'bg-[#9DEBCB]' },
  { name: '경상도', color: 'bg-[#FFD482]' },
  { name: '전라도', color: 'bg-[#FFBFAE]' },
  { name: '충청도', color: 'bg-[#D6F6B4]' },
  { name: '제주도', color: 'bg-[#FF9E7C]' },
  { name: '기타', color: 'bg-[#F9B5E2]' },
];

export default function RegionFilter() {
  return (
    <div className="flex gap-2 w-max">
      {regions.map((region) => (
        <div
          key={region.name}
          className={`${region.color} w-[52px] h-[52px] rounded-xl flex items-center justify-center text-[11px] text-white font-semibold`}
        >
          {region.name}
        </div>
      ))}
    </div>
  );
}
