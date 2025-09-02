import { FaCirclePlus } from 'react-icons/fa6';
import { FaFire } from 'react-icons/fa6';

export default function TaskCompleteModal({
  isOpen,
  setIsOpen,
  title,
  exp,
  credit,
}) {
  if (!isOpen) return null;

  return (
    <div className="max-w-[390px] w-full fixed top-0 bottom-0 left-1/2 transform -translate-x-1/2 tr bg-black/25 flex justify-center items-center z-50">
      <div className="flex flex-col items-center bg-background p-6 rounded-lg w-[90%]">
        <img src="/firecracker.png" />
        <span className="text-neutral-500 font-normal text-base">
          축하드려요!
        </span>
        <span className="text-neutral-900 font-semibold text-lg">{title}</span>
        <span className="text-neutral-900 font-normal text-lg">
          과제를 달성했어요 🤓
        </span>
        <div className="flex gap-2 my-4">
          <span className="text-neutral-500 font-normal text-base">보상: </span>
          <div className="flex items-center gap-1 text-background px-1 py-0.5 rounded-sm font-semibold bg-main-100">
            <FaCirclePlus size={15} />
            <span className="font-semibold text-xs">{exp}xp</span>
          </div>
          <div className="flex items-center gap-1 bg-background border border-main-5 px-1 rounded-sm font-normal text-main-100">
            <FaFire size={15} className="scale-x-[-1]" />
            <span className="text-neutral-900 text-xs">{credit}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
