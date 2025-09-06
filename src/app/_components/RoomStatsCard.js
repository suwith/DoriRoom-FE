'use client';

export default function RoomStatsCard({
  today,
  like,
  isLiked,
  onLike,
  className,
  isMine,
}) {
  return (
    <div
      className={`flex justify-center gap-2 max-w-[390px] w-screen mx-auto px-4 ${className}`}
    >
      <div className="flex flex-1 items-center justify-center gap-1 text-main-100 bg-main-5 text-lg rounded-lg px-4 py-2">
        <i className="mgc_calendar_fill mr-2" />
        <span className="font-normal">투데이</span>
        <span className="font-semibold">{today}</span>
      </div>

      <button
        onClick={onLike}
        disabled={!onLike || isMine}
        className={`flex flex-1 items-center justify-center gap-1 text-lg rounded-lg px-4 py-2
          ${
            isMine
              ? 'text-gray-300 bg-gray-100 cursor-not-allowed'
              : isLiked
                ? 'text-sub-100 bg-sub-5'
                : 'text-gray-400 bg-gray-100'
          }`}
      >
        <i className="mgc_thumb_up_2_fill mr-2" />
        <span className="font-normal">좋아요</span>
        <span className="font-semibold">{like}</span>
      </button>
    </div>
  );
}
