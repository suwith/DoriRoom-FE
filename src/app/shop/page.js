'use client';

import { useState } from 'react';
import { FaFire, FaShirt } from 'react-icons/fa6';
import {
  FaHatCowboy,
  FaShoePrints,
  FaClock,
  FaWindowMaximize,
  FaBoxes,
} from 'react-icons/fa';
import { RiWallet3Fill } from 'react-icons/ri';
import Item from '@/components/Item';
import ConfirmModal from '@/components/ConfirmModal';

export default function Shop() {
  const [selectBtn, setSelectBtn] = useState(1);
  const [selectedItemIdx, setSelectedItemIdx] = useState(null);
  const [isOpenBuyModal, setIsOpenBuyModal] = useState(false);

  const categoryBtns = [
    { id: 1, name: '의상', icon: FaShirt },
    { id: 2, name: '선반', icon: FaBoxes },
    { id: 3, name: '시계', icon: FaClock },
    { id: 4, name: '창문', icon: FaWindowMaximize },
    { id: 5, name: '모자', icon: FaHatCowboy },
    { id: 6, name: '신발', icon: FaShoePrints },
  ];

  function handleConfirm() {
    console.log('구매 API 호출');
  }

  return (
    <div className="flex justify-center h-screen pt-[30px]">
      <div className="flex flex-col w-full max-w-[390px] h-full px-3 font-sans">
        {/* 상단 고정: 보유 포인트 (왼쪽 정렬) */}
        <div className="sticky top-0 z-10 pt-4 pb-2">
          <div
            className="flex justify-center items-center max-w-[70px] gap-2 py-1 rounded-lg"
            style={{ boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}
          >
            <FaFire className="ml-1 trnsform scale-x-[-1] text-emerald-400 w-5 h-5" />
            <span className="font-bold text-emerald-400 text-lg">70</span>
          </div>
        </div>

        {/* 캐릭터 */}
        <div className="flex justify-center mt-20">
          <img
            src="/character.png"
            alt="character"
            className="w-[136px] h-[152px]"
          />
        </div>
        <div className="flex justify-end my-5">
          <button
            disabled={selectedItemIdx === null}
            className={`flex gap-2 items-center justify-center rounded-xl px-4 py-2 ${selectedItemIdx === null ? 'bg-neutral-300' : 'bg-emerald-400'}`}
            onClick={() => setIsOpenBuyModal(true)}
          >
            <RiWallet3Fill className="fill-white" size={20} />
            <p className="font-bold text-[14px]">구입하기</p>
          </button>
        </div>
        {/* 카테고리 버튼 */}
        <div className="flex overflow-x-auto scrollbar-hide gap-2">
          {categoryBtns.map(({ id, name, icon: Icon }) => {
            const isActive = selectBtn === id;

            return (
              <button
                key={id}
                onClick={() => setSelectBtn(id)}
                className={`flex-shrink-0 flex gap-2 items-center justify-center rounded-t px-5 py-2  min-h-[44px] ${
                  isActive ? 'bg-white' : 'bg-neutral-200'
                }`}
              >
                <Icon
                  className={`text-xl ${
                    isActive ? 'text-emerald-400' : 'text-neutral-400'
                  }`}
                />
                <p
                  className={`text-sm font-medium whitespace-nowrap ${
                    isActive ? 'text-emerald-400' : 'text-neutral-400'
                  }`}
                >
                  {name}
                </p>
              </button>
            );
          })}
        </div>

        {/* 아이템 리스트 (스크롤 영역) */}
        <div className="grid grid-cols-3 gap-2 bg-white py-2 overflow-y-auto scrollbar-hide pb-[80px]">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Item
              key={idx}
              onClick={() => setSelectedItemIdx(idx)}
              isSelected={selectedItemIdx === idx}
            />
          ))}
        </div>
      </div>
      {isOpenBuyModal && (
        <ConfirmModal
          isOpen={isOpenBuyModal}
          onConfirm={handleConfirm}
          message={'8 도깨비불로 장미 머리띠를 구매하시겠습니까?'}
          setIsOpen={setIsOpenBuyModal}
        />
      )}
    </div>
  );
}
