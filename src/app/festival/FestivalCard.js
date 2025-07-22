import { GoHeart } from 'react-icons/go';

export default function FestivalCard({ festival }) {
  return (
    <div className="bg-white overflow-hidden">
      <div
        className="relative bg-neutral-100 w-full h-40 bg-cover bg-center rounded-lg"
        style={{ backgroundImage: `url(${festival.thumbnail})` }}
      >
        <button className="absolute top-2 right-2">
          <GoHeart className="text-white w-5 h-5" />
        </button>
      </div>

      <div className="p-2 text-[11px]">
        <div className="flex flex-wrap gap-1 mb-1">
          <span className="text-green-600 font-semibold">
            {festival.region}
          </span>
          <span className="text-gray-400">{festival.category}</span>
          <span className="text-teal-500">후기 {festival.reviews}개</span>
          <span className="text-green-600">
            {festival.price === 0 ? '무료' : `${festival.price}원`}
          </span>
        </div>
        <div className="font-bold text-xs truncate">{festival.title}</div>
        <div className="text-gray-400 truncate">{festival.location}</div>
        <div className="text-gray-400">
          {festival.startDate}~{festival.endDate}
        </div>
      </div>
    </div>
  );
}
