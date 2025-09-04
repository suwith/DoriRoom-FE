'use client';

import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import FestivalListItem from '@/app/festival/_components/FestivalListItem';
import Icon from '@mdi/react';
import { mdiTree } from '@mdi/js';
import TwoButtonModal from '@/app/_components/TwoButtonModal';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import useDiaryLike from '@/hooks/diary/useDiaryLike';
import { useAuthStore } from '@/stores/useAuthStore';
import useDiaryDelete from '@/hooks/diary/useDiaryDelete';

export default function DiaryDetail({ diary }) {
  const router = useRouter();
  const [isBottomOpen, setIsBottomOpen] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const user = useAuthStore((state) => state.user);
  console.log(user);

  console.log(diary);
  const isMine = diary.author.id === user.userId;
  console.log(isMine);

  // 좋아요 훅 사용
  const {
    liked,
    loading: likeLoading,
    mutating: likeMutating,
    toggleLike,
  } = useDiaryLike(diary.id);

  const [likeCount, setLikeCount] = useState(diary.likes || 0);
  const displayLikeText = likeCount === 0 ? '좋아요' : likeCount;

  const { deleteDiary, loading: deleteLoading } = useDiaryDelete();

  const handleDelete = async (e) => {
    e.stopPropagation();
    const success = await deleteDiary(diary.id);
    if (success) {
      router.back(); // 삭제 후 뒤로가기
    }
    setShowDeleteModal(false);
  };

  return (
    <div className="pt-20 pb-60">
      <HeaderNavigationBar
        title={diary.festival?.title || ''}
        type="diary"
        onEditClick={() => console.log('수정 클릭')}
        onDeleteClick={() => setShowDeleteModal(true)}
        className="bg-background"
        isMine={isMine}
      />

      <div className="p-5 space-y-5 whitespace-pre-line">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={diary.author.image || '/images/profileImage_default.svg'}
              alt="profile"
              className="w-8 h-8 rounded-full oobject-cover"
            />
            <div className="text-sm font-semibold text-neutral-800">
              {diary.author.name}
            </div>
            {isMine && (
              <div className="text-[10px] bg-sub2-5 text-sub2-100 rounded-sm px-1 flex items-center justify-center">
                내 리뷰
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button className="text-[11px] px-3 py-0.5 bg-main-5 text-main-100 rounded">
              방문
            </button>
          </div>
        </div>
        <div className="text-sm text-neutral-800">{diary.content}</div>
        {diary.images?.length > 0 && (
          <div className="flex overflow-x-scroll gap-2 scrollbar-hide">
            {diary.images.map((src, idx) => (
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
            <button
              onClick={async () => {
                const nextLiked = !liked;
                await toggleLike();
                setLikeCount((prev) =>
                  nextLiked ? prev + 1 : Math.max(0, prev - 1)
                );
              }}
              disabled={likeLoading || likeMutating}
              aria-disabled={likeLoading || likeMutating}
              aria-pressed={liked}
            >
              <i
                className={`text-lg ${
                  liked
                    ? 'mgc_emoji_2_fill text-main-100'
                    : 'mgc_emoji_2_line text-neutral-400'
                }`}
              />
            </button>
            <span className={liked ? 'text-main-100' : 'text-neutral-400'}>
              {displayLikeText}
            </span>
          </div>
        </div>
      </div>

      {/* 관련 축제 바텀시트 */}
      {diary.festival && (
        <div
          className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[390px] mx-auto z-30 rounded-t-xl px-4 pt-4 pb-16 bg-main-5 shadow-[0_-4px_12px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out ${
            isBottomOpen ? 'translate-y-0' : 'translate-y-[85%]'
          }`}
        >
          <button
            type="button"
            className="w-20 h-1 bg-main-40 rounded-full mx-auto mb-3 block"
            onClick={() => setIsBottomOpen((v) => !v)}
            aria-label="관련 축제 패널 열기/닫기"
          />
          <div className="text-sm font-bold text-main-100 flex items-center gap-1 mb-3">
            <Icon path={mdiTree} className="w-4 h-4 text-main-100" />
            관련 축제
          </div>
          <button
            type="button"
            onClick={() => router.push(`/festival/${diary.festival.id}`)}
            className="w-full text-left"
          >
            <div
              className="bg-background rounded-xl py-1"
              style={{ boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)' }}
            >
              <FestivalListItem
                festival={diary.festival}
                hideLikeButton={true}
              />
            </div>
          </button>
        </div>
      )}

      {/* 삭제 모달 */}
      {showDeleteModal && (
        <TwoButtonModal
          title="일기를 삭제하시겠어요?"
          description="삭제된 일기는 복구가 불가능해요!"
          cancelText="취소할래요"
          confirmText="삭제할래요"
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
