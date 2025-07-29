import { FaCirclePlus } from 'react-icons/fa6';
import { FaFire } from 'react-icons/fa6';

export default function TaskCard({
  title,
  point,
  status,
  progress,
  complete,
  score,
  reward,
}) {
  return (
    <div
      className={`rounded-xl p-3 ${status === '달성' ? 'bg-sub-5' : status === '시작' ? 'bg-[#35C284]/15' : 'bg-neutral-100'}`}
    >
      <div className="flex justify-between items-center">
        <div className="flex gap-1 items-center text-xs">
          <div
            className={`flex items-center gap-1 text-white px-1 py-1 rounded-sm font-semibold ${status === '달성' ? 'bg-sub-100' : 'bg-main-100'}`}
          >
            <FaCirclePlus size={15} />
            {point}xp
          </div>
          <div
            className={`flex items-center gap-1 bg-white px-2 py-1 rounded-sm font-normal ${status === '달성' ? 'text-sub-100' : 'text-main-100'}`}
          >
            <FaFire size={15} className="scale-x-[-1]" />
            <span className="text-neutral-900">{reward}</span>
          </div>
        </div>
      </div>
      <div
        className={`flex justify-between items-center text-sm font-semibold mt-2 ${status === '달성' ? 'text-neutral-400' : 'text-neutral-900'}`}
      >
        {title}
        {status !== '달성' ? (
          <div className="w-[30%]">
            <p className="text-xs text-main-100 font-medium text-end">
              {score}/{complete}
            </p>
            {progress !== undefined && (
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="bg-main-100 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        ) : (
          <button className="mr-2 bg-sub-15 text-sub-100 rounded-sm px-2 py-1">
            달성
          </button>
        )}
      </div>
    </div>
  );
}
