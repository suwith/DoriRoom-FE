'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FestivalListItem from '@/app/festival/_components/FestivalListItem';
import { mockFestivals } from '@/app/festival/mockData';
import BackButton from '@/app/_components/BackButton';

export default function BookmarkPage() {
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState(mockFestivals);
  const [editMode, setEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDelete = () => {
    setBookmarks((prev) =>
      prev.filter((item) => !selectedIds.includes(item.id))
    );
    setSelectedIds([]);
    setEditMode(false);
    setShowDeleteModal(false);
  };

  const toggleAll = () => {
    if (selectedIds.length === bookmarks.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(bookmarks.map((b) => b.id));
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    setSelectedIds([]);
  };

  return (
    <div className="max-w-[390px] mx-auto h-screen bg-white pb-28">
      {/* 상단 헤더 */}
      <div className="relative w-full h-[60px] flex items-center justify-center px-4 ">
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
            {editMode ? '전체선택' : '편집'}
          </button>
        )}
      </div>

      {bookmarks.length === 0 && (
        <div className="space-y-4 h-full">
          <div
            className="flex flex-col h-full items-center justify-center gap-3"
            style={{ height: 'calc(100% - 80px)' }}
          >
            <i className="mgc_sweats_fill text-6xl text-main-100" />
            <p className="text-center text-lg font-semibold">
              앗, 저장된 축제가 없어요!
            </p>
            <p className="text-center text-sm text-neutral-500">
              방문하고 싶으신 축제를 저장해 주세요 ☺️
            </p>
            <button
              onClick={() => router.push('/festival')}
              className="mt-4 px-6 py-2 rounded-md bg-main-5 text-main-100 text-xl font-medium "
            >
              축제 메인으로 돌아가기
            </button>
          </div>{' '}
        </div>
      )}

      {bookmarks.length > 0 && (
        <div className="space-y-3">
          {bookmarks.map((festival) => {
            const isSelected = selectedIds.includes(festival.id);

            return (
              <div
                key={festival.id}
                className={` relative rounded-md ${isSelected && editMode ? 'bg-sub-5' : ''}  `}
                onClick={() => {
                  if (!editMode) router.push(`/festival/${festival.id}`);
                }}
              >
                <FestivalListItem festival={festival} hideLikeButton={true} />
                {editMode && (
                  <button
                    onClick={() => toggleSelect(festival.id)}
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

      {/* 하단 삭제 버튼 */}
      {selectedIds.length > 0 && (
        <button
          onClick={() => setShowDeleteModal(true)}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[350px] py-2 bg-main-100 text-background text-lg rounded-lg font-medium shadow-md"
        >
          {selectedIds.length > 0
            ? `${selectedIds.length}개 삭제하기`
            : '삭제할 항목을 선택하세요'}
        </button>
      )}

      {/* 삭제 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex justify-center">
          <div className="w-full max-w-[390px] bg-black/30 px-4 flex items-center justify-center">
            <div className="bg-white w-full rounded-xl p-4 text-center shadow-lg">
              <p className="text-base font-semibold mt-3">
                즐겨찾기를 삭제하시겠어요?
              </p>
              <p className="text-base font-semibold">
                삭제된 즐겨찾기는 복구가 불가능해요!
              </p>
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2.5 bg-main-5 text-main-100 font-semibold rounded-md shadow-[0_0_3px_rgba(0,0,0,0.1)]"
                >
                  취소할래요
                </button>

                <button
                  onClick={handleDelete}
                  className="flex-1 py-2.5 bg-main-100 text-background font-semibold rounded-md"
                >
                  삭제할래요
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
