'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TwoButtonModal from '@/app/_components/TwoButtonModal';
import useDiaryLike from '@/hooks/diary/useDiaryLike';
import useDiaryDelete from '@/hooks/diary/useDiaryDelete';

export default function DiaryListItem({ diary, onDeleted }) {
  const router = useRouter();
  const [showDiaryMenu, setShowDiaryMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 좋아요 훅
  const {
    liked,
    loading: likeLoading,
    mutating: likeMutating,
    toggleLike,
  } = useDiaryLike(diary.id);

  const [likeCount, setLikeCount] = useState(diary.likes ?? 0);

  const { deleteDiary, loading: deleteLoading } = useDiaryDelete();

  const handleDelete = async (e) => {
    e.stopPropagation();
    const success = await deleteDiary(diary.id);
    if (success) {
      onDeleted?.(diary.id);
    }
    setShowDiaryMenu(false);
    setShowDeleteModal(false);
  };
  return (
    <div
      className="bg-background rounded-lg p-3 space-y-2"
      onClick={() => {
        if (showDiaryMenu) return;
        router.push(`/diary/${diary.id}`);
      }}
    >
      <div className="flex items-center justify-between">
        {/* 축제명 */}
        <div className="inline-block text-[13px] font-medium text-main-100 bg-main-5 px-2 py-0.5 rounded-md">
          {diary.festivalName || '연결된 축제 없음'}
        </div>
        <div>
          <i
            className="mgc_more_2_line text-neutral-300 text-md"
            onClick={(e) => {
              e.stopPropagation();
              setShowDiaryMenu((prev) => !prev);
            }}
          />
          {showDiaryMenu && (
            <div className="absolute right-6 mt-0 w-24 bg-background border border-neutral-100 text-neutral-600 rounded shadow-md text-sm z-50">
              <button
                className="w-full text-center px-4 py-2 hover:bg-neutral-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDiaryMenu(false);
                  sessionStorage.setItem('editingDiary', JSON.stringify(diary));
                  console.log(sessionStorage.getItem('editingDiary'));
                  router.push(`/diary/${diary.id}/edit`);
                }}
              >
                수정
              </button>
              <hr className="text-neutral-100" />
              <button
                className="w-full text-center px-4 py-2 hover:bg-neutral-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteModal(true);
                }}
              >
                삭제
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 일기 내용 */}
      <div className="text-xs text-neutral-700 leading-snug">
        {diary.content.length > 120
          ? `${diary.content.slice(0, 120)}...`
          : diary.content}
      </div>

      {/* 이미지 썸네일 */}
      {diary.images?.length > 0 && (
        <div className="flex overflow-x-auto gap-2 scrollbar-hide">
          {diary.images.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`diary-${idx}`}
              className="w-[110px] h-[110px] object-cover rounded-lg flex-shrink-0"
            />
          ))}
        </div>
      )}

      {/* 날짜 + 좋아요 개수 */}
      <div className="flex items-center justify-between text-[11px] text-neutral-400">
        <div className="flex items-center gap-1 text-main-100">
          <button
            onClick={async (e) => {
              e.stopPropagation();
              const nextLiked = !liked;
              await toggleLike();
              setLikeCount((prev) =>
                nextLiked ? prev + 1 : Math.max(0, prev - 1)
              );
            }}
            disabled={likeLoading || likeMutating}
            aria-disabled={likeLoading || likeMutating}
            aria-pressed={liked}
            className="flex items-center"
          >
            {liked ? (
              <i className="mgc_emoji_2_fill text-md text-main-100" />
            ) : (
              <i className="mgc_emoji_2_line text-md text-neutral-400" />
            )}
          </button>
          <span
            className={`flex items-center ${liked ? 'text-main-100' : 'text-neutral-400'}`}
          >
            {likeCount}
          </span>
        </div>
        <div>{diary.date}</div>
      </div>

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
