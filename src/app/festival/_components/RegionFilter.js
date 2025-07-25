const regions = [
  { name: '서울', icon: '/icons/region/서울.svg' },
  { name: '경기도', icon: '/icons/region/경기도.svg' },
  { name: '강원도', icon: '/icons/region/강원도.svg' },
  { name: '경상도', icon: '/icons/region/경상도.svg' },
  { name: '전라도', icon: '/icons/region/전라도.svg' },
  { name: '충청도', icon: '/icons/region/충청도.svg' },
  { name: '제주도', icon: '/icons/region/제주도.svg' },
];

export default function RegionFilter() {
  return (
    <div className="flex gap-3 overflow-x-auto w-full scrollbar-hide">
      {regions.map((region) => (
        <div
          key={region.name}
          className="flex flex-col items-center gap-[6px] shrink-0"
        >
          <div
            className={
              'w-[45px] h-[45px] rounded-full flex items-center justify-center'
            }
          >
            <img src={region.icon} alt={region.name} />
          </div>
          <span className="text-[11px] text-neutral-800">{region.name}</span>
        </div>
      ))}
    </div>
  );
}
