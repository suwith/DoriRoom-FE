import { FaCirclePlus } from 'react-icons/fa6';
import { FaFire } from 'react-icons/fa6';
import { IoMdMap } from 'react-icons/io';
import MapModal from '../Map/MapModal';
import { useState } from 'react';

export default function RegionTaskCard({
  title,
  point,
  status,
  progress,
  complete,
  score,
  reward,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`rounded-xl p-3 ${status === '달성' ? 'bg-sub-5' : status === '시작' ? 'bg-[#35C284]/15' : 'bg-neutral-100'}`}
    >
      <div className="flex justify-between items-center">
        <div className="flex gap-1 items-center text-xs">
          <div
            className={`flex items-center gap-1 text-background px-1 py-1 rounded-sm font-semibold ${status === '달성' ? 'bg-sub-100' : 'bg-main-100'}`}
          >
            <FaCirclePlus size={15} />
            {point}xp
          </div>
          <div
            className={`flex items-center gap-1 bg-background px-2 py-1 rounded-sm font-normal ${status === '달성' ? 'text-sub-100' : 'text-main-100'}`}
          >
            <FaFire size={15} className="scale-x-[-1]" />
            <span className="text-neutral-900">{reward}</span>
          </div>
        </div>
        <div
          className="self-start flex items-center justify-center bg-white p-0.5 mr-1 rounded-md"
          onClick={() => setIsOpen(true)}
        >
          <IoMdMap className="text-main-100 text-lg" />
        </div>
      </div>
      <div
        className={`flex justify-between items-center text-xs font-semibold mt-2 ${status === '달성' ? 'text-neutral-400' : 'text-neutral-900'}`}
      >
        <div className="flex items-center gap-1 text-sm">
          {title}
          {status === '시작' && <p className="text-main-100">({progress}%)</p>}
        </div>
        {status === '시작' ? (
          <button className="mr-1 bg-main-5 text-main-100 rounded-sm px-2 py-1">
            도전 중
          </button>
        ) : status === '대기' ? (
          <button className="mr-1 bg-main-100 text-background rounded-sm px-2 py-1">
            도전
          </button>
        ) : (
          <button className="mr-1 bg-sub-15 text-sub-100 rounded-sm px-2 py-1">
            달성
          </button>
        )}
      </div>
      <MapModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        coordinates={[
          [126.93058863174969, 37.38487638219797],
          [126.93108699436652, 37.38421177044464],
          [126.93111905277988, 37.38422334909711],
          [126.93129100245449, 37.384010301607134],
          [126.93235184451322, 37.38457070783717],
          [126.93163781620433, 37.385432150569585],
          [126.93058863174969, 37.38487638219797],
        ]}
      />
    </div>
  );
}
