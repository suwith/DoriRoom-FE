import { FiHeart } from 'react-icons/fi';

export default function FestivalCard() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm">
      <div className="relative bg-gray-300 w-full h-28">
        <button className="absolute top-2 right-2">
          <FiHeart className="text-white" />
        </button>
      </div>

      <div className="p-2 text-[11px]">
        <div className="flex flex-wrap gap-1 mb-1">
          <span className="text-green-600 font-semibold">강원</span>
          <span className="text-gray-400">관광형</span>
          <span className="text-teal-500">후기 3개</span>
          <span className="text-green-600">무료</span>
        </div>
        <div className="font-bold text-xs truncate">
          제5회 강릉 비치비어페스티벌
        </div>
        <div className="text-gray-400 truncate">경포해변 중앙광장</div>
        <div className="text-gray-400">2025.06.27~2025.06.29</div>
      </div>
    </div>
  );
}
