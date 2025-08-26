'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import FestivalListItem from '@/app/festival/_components/FestivalListItem';
import BackButton from '@/app/_components/BackButton';
import TwoButtonModal from '@/app/_components/TwoButtonModal';
import useFavoriteFestivals from '@/hooks/festival/useFavoriteFestivals';
import useDeleteFavoriteFestivals from '@/hooks/festival/useDeleteFavoriteFestivals';
import LoadingModal from '@/app/_components/LoadingModal';
import ErrorContent from '@/app/_components/ErrorContent';

const HEADER_TOP_PAD = 50; // 상단 안전 여백
const TOOLBAR_HEIGHT = 60; // 헤더 툴바 높이
const HEADER_TOTAL = HEADER_TOP_PAD + TOOLBAR_HEIGHT; // 110px

export default function BookmarkPage() {
  const router = useRouter();
  const {
    festivals: bookmarks,
    loading,
    error,
    setFestivals,
  } = useFavoriteFestivals();

  const { deleteFavorites, loading: deleting } = useDeleteFavoriteFestivals();

  const [editMode, setEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const allSelected = useMemo(
    () => bookmarks.length > 0 && selectedIds.length === bookmarks.length,
    [bookmarks.length, selectedIds.length]
  );

  const hasBottomAction = selectedIds.length > 0;

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (allSelected) setSelectedIds([]);
    else setSelectedIds(bookmarks.map((b) => b.id));
  };

  const cancelEdit = () => {
    setEditMode(false);
    setSelectedIds([]);
  };

  const handleDelete = async () => {
    const eventIds = selectedIds;
    setShowDeleteModal(false);
    if (eventIds.length === 0) return;

    const prev = bookmarks;
    setFestivals((cur) => cur.filter((f) => !eventIds.includes(f.id)));

    const res = await deleteFavorites(eventIds);
    if (!res.ok) {
      setFestivals(prev);
      return;
    }
    setSelectedIds([]);
    setEditMode(false);
  };

  if (loading) return <LoadingModal open={true} />;
  if (error) {
    const msg =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      '알 수 없는 오류가 발생했습니다.';
    return <ErrorContent message={msg} />;
  }

  return (
    <div className="relative mx-auto max-w-[390px] h-screen bg-background">
      {/* 고정 헤더 */}
      <header
        className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-[390px] pt-[50px] bg-background"
        style={{ height: HEADER_TOTAL }}
        aria-hidden={false}
      >
        <div className="relative w-full h-[60px] flex items-center justify-center px-4">
          {editMode ? (
            <button
              onClick={cancelEdit}
              className="absolute left-4 text-sm text-main-100"
            >
              취소
            </button>
          ) : (
            <div className="absolute left-4 text-4xl">
              <BackButton />
            </div>
          )}
          <h1 className="text-lg font-semibold">즐겨찾기</h1>
          {bookmarks.length > 0 && (
            <button
              onClick={editMode ? toggleAll : () => setEditMode(true)}
              className="absolute right-4 text-sm text-main-100"
            >
              {editMode ? (allSelected ? '전체해제' : '전체선택') : '편집'}
            </button>
          )}
        </div>
      </header>

      {/* 스크롤 영역: 헤더 아래부터 화면 하단까지 */}
      <main
        className={`absolute left-0 right-0 mx-auto max-w-[390px] overflow-y-auto scrollbar-hide `}
        style={{
          top: HEADER_TOTAL,
          height: `calc(100vh - ${HEADER_TOTAL}px)`,
          paddingBottom: hasBottomAction ? '92px' : '20px', // 하단 버튼이 있을 때 가리지 않도록 여유
        }}
      >
        {bookmarks.length === 0 && (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <i className="mgc_sweats_fill text-6xl text-main-100" />
            <p className="text-center text-lg font-semibold">
              앗, 저장된 축제가 없어요!
            </p>
            <p className="text-center text-sm text-neutral-500">
              방문하고 싶으신 축제를 저장해 주세요
            </p>
            <button
              onClick={() => router.push('/festival')}
              className="mt-4 px-6 py-2 rounded-md bg-main-5 text-main-100 text-xl font-medium"
            >
              축제 메인으로 돌아가기
            </button>
          </div>
        )}

        {bookmarks.length > 0 && (
          <div className="space-y-3">
            {bookmarks.map((festival) => {
              const isSelected = selectedIds.includes(festival.id);
              return (
                <div
                  key={festival.id}
                  className={`relative rounded-md ${isSelected && editMode ? 'bg-sub-5' : ''}`}
                  onClick={() => {
                    if (!editMode) router.push(`/festival/${festival.id}`);
                    else toggleSelect(festival.id);
                  }}
                >
                  <FestivalListItem festival={festival} hideLikeButton={true} />
                  {editMode && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelect(festival.id);
                      }}
                      className="absolute right-4 top-1.5 text-xl z-10"
                    >
                      <i
                        className={`${
                          isSelected
                            ? 'mgc_check_circle_fill text-sub-100'
                            : 'mgc_check_circle_line text-neutral-300'
                        }`}
                      />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 하단 고정 삭제 버튼 */}
      {hasBottomAction && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-7 z-50 w-full max-w-[390px] px-4">
          <button
            disabled={deleting}
            onClick={() => setShowDeleteModal(true)}
            className="w-full py-2 bg-main-100 disabled:opacity-70 text-background text-lg rounded-lg font-medium shadow-md"
          >
            {deleting ? '삭제 중...' : `${selectedIds.length}개 삭제하기`}
          </button>
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
