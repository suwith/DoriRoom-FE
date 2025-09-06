'use client';

import BackButton from '../_components/BackButton';
import TaskInfoModal from '../collection/_components/Task/TaskInfoModal';
import { useState } from 'react';
import QuizQuitModal from '../collection/_components/Quiz/QuizQuitModal';

export default function HeaderNavigationBar({
  title = '제목 없음',
  showBackButton = true,
  className = '',
  type = 'general',
  lv = 0,
  onEditClick,
  onDeleteClick,
  regionId = null,
  onBackClick,
  isMine,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDiaryMenu, setShowDiaryMenu] = useState(false);

  return (
    <header
      className={`fixed top-0 left-1/2 transform -translate-x-1/2 z-50 max-w-[390px] w-full pt-[50px] pb-[20px] ${className}`}
    >
      <div className="relative flex items-center justify-center mx-auto">
        {/* 중앙 타이틀 */}
        {type === 'collection' && (
          <div className="bg-sub-5 px-1 py-1 text-xs text-sub-100 mr-2">
            Lv.{lv}
          </div>
        )}
        <h1 className="text-lg font-semibold text-gray-800">{title}</h1>

        {/* 뒤로가기 버튼 */}
        {showBackButton && (
          <div className="absolute left-[16px]" onClick={onBackClick}>
            <BackButton />
          </div>
        )}
        {type === 'quiz' && (
          <div className="absolute left-[16px]" onClick={() => setIsOpen(true)}>
            <i className={`mgc_left_line text-3xl text-neutral-500`} />
          </div>
        )}
        {type === 'collection' && (
          <i
            className="absolute right-[16px] mgc_information_fill text-neutral-500 text-xl"
            onClick={() => setIsOpen(true)}
          />
        )}
        <TaskInfoModal isOpen={isOpen} setIsOpen={setIsOpen} />

        {/* 일기장 토글 버튼 */}
        {type === 'diary' && isMine && (
          <div className="absolute right-5">
            <i
              className="mgc_more_2_fill text-neutral-500 text-2xl"
              onClick={() => setShowDiaryMenu((prev) => !prev)}
            />
            {showDiaryMenu && (
              <div className="absolute right-0 mt-0 w-24 bg-background border border-neutral-100 text-neutral-600 rounded shadow-md text-sm z-50">
                <button
                  className="w-full text-center px-4 py-2 hover:bg-neutral-100"
                  onClick={() => {
                    setShowDiaryMenu(false);
                    onEditClick?.();
                  }}
                >
                  수정
                </button>
                <hr className="text-neutral-100" />
                <button
                  className="w-full text-center px-4 py-2 hover:bg-neutral-100"
                  onClick={() => {
                    setShowDiaryMenu(false);
                    onDeleteClick?.();
                  }}
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {type === 'collection' && (
        <TaskInfoModal isOpen={isOpen} setIsOpen={setIsOpen} />
      )}
      {type === 'quiz' && (
        <QuizQuitModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          regionId={regionId}
        />
      )}
    </header>
  );
}
