import { FaCirclePlus } from 'react-icons/fa6';
import { FaFire } from 'react-icons/fa6';
import { IoIosArrowForward } from 'react-icons/io';

export default function RegionTaskCard({
  challengeId,
  title,
  content,
  startDate,
  endDate,
  challengeGroup,
  areaGroup,
  challengeType,
  targetCount,
  eventId,
  rewards,
  currentProgress,
  status,
}) {
  return (
    <div
      className={`rounded-xl p-3 ${status === 'COMPLETED' ? 'bg-sub-5' : status === 'IN_PROGRESS' ? 'bg-[#35C284]/15' : status === 'WAIT_REWARD' ? 'bg-sub2-5' : 'bg-neutral-100'}`}
    >
      <div className="flex justify-between items-center">
        <div className="flex gap-1 items-center text-xs">
          <div
            className={`flex items-center gap-1 text-background px-1 py-1 rounded-sm font-semibold ${status === 'COMPLETED' ? 'bg-sub-100' : status === 'WAIT_REWARD' ? 'bg-sub2-100' : 'bg-main-100'}`}
          >
            <FaCirclePlus size={15} />
            {rewards.find((reward) => reward.rewardType === 'EXP').amount}xp
          </div>
          <div
            className={`flex items-center gap-1 bg-background px-2 py-1 rounded-sm font-normal ${status === 'COMPLETED' ? 'text-sub-100' : 'text-main-100'}`}
          >
            <FaFire size={15} className="scale-x-[-1]" />
            <span className="text-neutral-900">
              {rewards.find((reward) => reward.rewardType === 'CREDIT').amount}
            </span>
          </div>
        </div>
        <IoIosArrowForward className="mr-1 text-neutral-500 self-start" />
      </div>
      <div
        className={`flex justify-between items-center text-xs font-semibold mt-2 ${status === '달성' ? 'text-neutral-400' : 'text-neutral-900'}`}
      >
        <div className="flex items-center gap-1 text-sm">
          {title}
          {status === 'COMPLETED' && challengeType === 'VISIT_EVENT' && (
            <p className="text-main-100">({progress}%)</p>
          )}
        </div>
        {status === 'IN_PROGRESS' ? (
          <button className="mr-1 bg-main-5 text-main-100 rounded-sm px-2 py-1">
            도전 중
          </button>
        ) : status === 'NOT_STARTED' ? (
          <button className="mr-1 bg-main-100 text-background rounded-sm px-2 py-1">
            도전
          </button>
        ) : status === 'WAIT_REWARD' ? (
          <button className="mr-1 bg-sub2-15 text-sub2-100 rounded-sm px-2 py-1">
            보상 받기
          </button>
        ) : (
          <button className="mr-1 bg-sub-15 text-sub-100 rounded-sm px-2 py-1">
            달성
          </button>
        )}
      </div>
    </div>
  );
}
