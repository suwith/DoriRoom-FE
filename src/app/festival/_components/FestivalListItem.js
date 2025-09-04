'use client';

import { GoHeart, GoHeartFill } from 'react-icons/go';
import { FaCommentAlt } from 'react-icons/fa';
import { useRef, useState } from 'react';
import useFestivalFavorite from '@/hooks/festival/useFestivalFavorite';
import TwoButtonModal from '@/app/_components/TwoButtonModal';
import { useRouter } from 'next/navigation';
import useDiaryWritten from '@/hooks/diary/useDiaryWritten';

export default function FestivalListItem({
  festival,
  hideLikeButton = false,
  mode = 'default',
  onSelect = null,
}) {
  const router = useRouter();
  const imgRef = useRef(null);
  const [showAlreadyWrittenModal, setShowAlreadyWrittenModal] = useState(false);
  const { written, loading: writtenLoading } = useDiaryWritten(
    festival.eventId
  );

  console.log('written', written);

  const { liked, likeCount, loading, mutating, toggleFavorite } =
    useFestivalFavorite(festival.eventId, festival.likes || 0);

  const handleLike = (e) => {
    e.stopPropagation();
    if (!loading && !mutating) toggleFavorite();
  };

  // 선택 버튼 클릭 시 확인 로직 (추후 API 연결 예정)
  const handleSelect = () => {
    if (written) {
      setShowAlreadyWrittenModal(true);
    } else {
      onSelect?.(festival);
    }
  };

  if (mode === 'select') {
    return (
      <div className="flex gap-3 items-center">
        <img
          ref={imgRef}
          src={festival.thumbnail || '/images/festivalImage_default.svg'}
          alt={festival.title}
          className="object-cover w-15 h-15 rounded-lg overflow-hidden"
          onError={(e) => {
            if (e.currentTarget.src.endsWith('festivalImage_default.svg'))
              return;
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/images/festivalImage_default.svg';
          }}
        />
        <div className="flex justify-between flex-1 gap-2 items-center">
          <div className="flex-3 flex-col justify-center items-start min-w-0">
            <div className="text-sm font-semibold line-clamp-1 break-keep">
              {festival.title}
            </div>
            <div className="text-neutral-600 mt-0.5 text-xs line-clamp-1 break-keep">
              {festival.location}
            </div>
          </div>

          <button
            className="flex text-background text-sm bg-main-100 px-3 py-1.5 rounded-sm "
            onClick={(e) => {
              e.stopPropagation();
              handleSelect();
            }}
          >
            선택
          </button>
        </div>
        {showAlreadyWrittenModal && (
          <TwoButtonModal
            title="방문한 축제에 대해서는 하나의 일기만 작성할 수 있어요! 😭"
            description="다른 축제를 선택하시겠습니까?"
            cancelText="작성 취소하기"
            confirmText="다른 축제 검색"
            onCancel={() => {
              setShowAlreadyWrittenModal(false);
              router.replace(`/diary`);
            }}
            onConfirm={() => {
              setShowAlreadyWrittenModal(false);
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className={`flex gap-3 ${hideLikeButton ? 'px-4 py-2' : ''}`}>
      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
        <img
          ref={imgRef}
          src={festival.thumbnail || '/images/festivalImage_default.svg'}
          alt={festival.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            if (e.currentTarget.src.endsWith('festivalImage_default.svg'))
              return;
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/images/festivalImage_default.svg';
          }}
        />

        {!hideLikeButton && (
          <button
            type="button"
            aria-label={liked ? '즐겨찾기 취소' : '즐겨찾기 추가'}
            aria-pressed={liked}
            disabled={loading || mutating}
            className="absolute top-1.5 left-2 z-10"
            onClick={handleLike}
          >
            {liked ? (
              <GoHeartFill className="text-main-100 w-4 h-4 drop-shadow" />
            ) : (
              <GoHeart className="text-background w-4 h-4 drop-shadow" />
            )}
          </button>
        )}
      </div>

      <div className="flex flex-col justify-between flex-1 pr-1 min-w-0">
        <div>
          <div className="flex flex-wrap gap-1 mb-1 text-[11px]">
            {!!festival.region && (
              <span className="text-main-100 bg-main-5 px-1 py-[1px] rounded-sm">
                {String(festival.region).slice(0, 2)}
              </span>
            )}
            {!!festival.category && (
              <span className="text-main-100 bg-main-5 px-1 py-[1px] rounded-sm">
                {festival.category}
              </span>
            )}
            {festival.reviews > 0 && (
              <span className="text-main-100 bg-main-5 px-1 py-[1px] rounded-sm">
                일기 {festival.reviews}개
              </span>
            )}
            {festival.price === '무료' && (
              <span className="text-main-100 bg-main-5 px-1 py-[1px] rounded-sm">
                무료
              </span>
            )}
          </div>

          {/* 제목/위치: 카드 내 넘침 방지 */}
          <div className="font-bold text-sm mt-1 line-clamp-1 break-keep">
            {festival.title}
          </div>
          <div className="text-neutral-600 mt-0.5 text-xs line-clamp-1 break-keep">
            {festival.location}
          </div>
        </div>

        <div className="flex justify-between items-end mt-2">
          <div className="text-neutral-400 text-[11px] font-thin">
            {festival.startDate}~{festival.endDate}
          </div>
          <div className="flex gap-3 text-[11px] ">
            <div className="flex items-center gap-1 text-main-100">
              <GoHeartFill className="w-3.5 h-3.5" />
              <span>{likeCount}</span>
            </div>
            <div className="flex items-center gap-1 text-main-100">
              <FaCommentAlt className="w-3.5 h-3.5" />
              <span>{festival.reviews}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
