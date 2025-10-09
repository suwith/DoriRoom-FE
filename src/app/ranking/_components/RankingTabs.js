'use client';

export default function RankingTabs({ tab, setTab }) {
  return (
    <div className="flex w-full border-b border-gray-200 mb-4">
      {['전체 랭킹', '지역 랭킹'].map((t) => (
        <button
          key={t}
          onClick={() => setTab(t)}
          className={`flex-1 pb-2 font-medium text-center relative ${
            tab === t ? 'text-main-100' : 'text-gray-400'
          }`}
        >
          {t}
          {tab === t && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-main-100 rounded-full"></span>
          )}
        </button>
      ))}
    </div>
  );
}
