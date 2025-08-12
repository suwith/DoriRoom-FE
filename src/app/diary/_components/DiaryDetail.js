'use client';

import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import { useState } from 'react';
import { mockFestivals } from '@/app/festival/mockData';
import FestivalListItem from '@/app/festival/_components/FestivalListItem';
import Icon from '@mdi/react';
import { mdiTree } from '@mdi/js';
import TwoButtonModal from '@/app/_components/TwoButtonModal';
import { useRouter } from 'next/navigation';

export default function DiaryDetail({ diary }) {
  const router = useRouter();
  const [likedIds, setLikedIds] = useState([]);
  const [isBottomOpen, setIsBottomOpen] = useState(true);

  const isLiked = likedIds.includes(diary.id);
  const likeCount = diary.likes + (isLiked ? 1 : 0);
  const displayLikeText = likeCount === 0 ? '좋아요' : likeCount;
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = () => {
    console.log('삭제 완료');
    setShowDeleteModal(false);
  };

  const handleLike = (id) => {
    setLikedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const festival = mockFestivals.find((f) => f.id === diary.festivalId);

  return (
    <div className="pt-20 pb-28">
      <HeaderNavigationBar
        title={festival.title}
        type="diary"
        onEditClick={() => console.log('수정 클릭')}
        onDeleteClick={() => setShowDeleteModal(true)}
        className="bg-background"
      />

      <div className="p-5 space-y-5 whitespace-pre-line">
        <div className="text-sm">{diary.content}</div>
        {diary.images?.length > 0 && (
          <div className="flex overflow-x-scroll gap-2 scrollbar-hide">
            {diary.images?.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`diary-${idx}`}
                className="w-[140px] h-[140px] object-cover rounded-lg"
              />
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className="text-xs text-neutral-400">{diary.date} •</div>
          <div className="flex items-center gap-1 text-xs">
            <button onClick={() => handleLike(diary.id)}>
              <i
                className={`text-lg ${
                  isLiked
                    ? 'mgc_emoji_2_fill text-main-100'
                    : 'mgc_emoji_2_line text-neutral-400'
                }`}
              />
            </button>
            <span className={isLiked ? 'text-main-100' : 'text-neutral-400'}>
              {displayLikeText}
            </span>
          </div>
        </div>
      </div>

      {/* 관련 축제 바텀시트 */}
      {festival && isBottomOpen && (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[390px] mx-auto pb-16 z-30 rounded-t-xl px-4 pt-4 bg-main-5 shadow-[0_-4px_12px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out ">
          <div className="w-20 h-1 bg-main-40 rounded-full mx-auto mb-2" />
          <div className="text-sm font-bold text-main-100 flex items-center gap-1 mb-3">
            <Icon path={mdiTree} className="w-4 h-4 text-main-100" />
            관련 축제
          </div>
          <div
            className="bg-background rounded-xl py-1"
            style={{
              boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)',
            }}
            onClick={() => router.push(`/festival/${festival.id}`)}
          >
            <FestivalListItem festival={festival} hideLikeButton={true} />
          </div>
        </div>
      )}

      {/* 삭제 모달 */}
      {showDeleteModal && (
        <TwoButtonModal
          title="즐겨찾기를 삭제하시겠어요?"
          description="삭제된 즐겨찾기는 복구가 불가능해요!"
          cancelText="취소할래요"
          confirmText="삭제할래요"
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
