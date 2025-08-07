import { FaCirclePlus } from 'react-icons/fa6';
import { FaFire } from 'react-icons/fa6';

export default function TaskCompleteModal({
  isOpen,
  setIsOpen,
  title,
  xp,
  reward,
}) {
  if (!isOpen) return null;

  return (
    <div className="max-w-[390px] w-full fixed top-0 bottom-0 bg-black/50 flex justify-center items-center z-50">
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
            <span className="font-semibold text-xs">{200}xp</span>
          </div>
          <div className="flex items-center gap-1 bg-background px-1 rounded-sm font-normal text-main-100">
            <FaFire size={15} className="scale-x-[-1]" />
            <span className="text-neutral-900 text-xs">{10}</span>
          </div>
        </div>
        <button
          className="bg-main-100 w-full text-background rounded-lg py-2.5 font-semibold text-xl"
          onClick={() => setIsOpen(false)}
        >
          보상 받기
        </button>
      </div>
    </div>
  );
}
