'use client';

import { useState } from 'react';
import { FaFire } from 'react-icons/fa6';
import { RiWallet3Fill } from 'react-icons/ri';
import ConfirmModal from '@/app/shop/_components/ConfirmModal';
import CategoryItemPanel from '../_components/CategoryItemPanel';
import useItemAll from '@/hooks/shop/useItemAll';

export default function Shop() {
  const [selectedItemIdx, setSelectedItemIdx] = useState(null);
  const [isOpenBuyModal, setIsOpenBuyModal] = useState(false);
  const { items, loading, error } = useItemAll();

  // 유저가 가지고 있는 크레딧
  const credit = 222000;

  const selectedItem = items.find((item) => item.id === selectedItemIdx);

  function handleConfirm() {
    // 현재 이 유저가 가지고 있는 크레딧 조회
    if (credit >= selectedItem.price) {
      // 구매 요청 API 호출
      alert('구매가 완료되었습니다.');
      setIsOpenBuyModal(false);
    } else {
      alert('크레딧이 부족합니다.');
      setIsOpenBuyModal(false);
    }
  }

  return (
    <div className="flex justify-center h-screen pt-[30px] bg-neutral-100">
      <div className="flex flex-col max-w-[390px] mx-auto">
        {/* 상단 고정: 보유 포인트 (왼쪽 정렬) */}
        <div className="sticky flex top-0 z-10 pt-4 pb-2 pl-3">
          <div
            className="flex justify-center items-center gap-2 py-1 rounded-lg w-auto px-2"
            style={{ boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}
          >
            <FaFire className="ml-1 trnsform scale-x-[-1] text-main-100 w-5 h-5" />
            <p className="font-bold text-main-100 text-lg">{credit}</p>
          </div>
        </div>

        {/* 캐릭터 */}
        <div className="shrink-0 mt-20 flex justify-center">
          <img
            src="/character.png"
            alt="character"
            className="w-[136px] h-[152px]"
          />
        </div>
        <div className="flex justify-end my-5 pr-3 text-background">
          <button
            disabled={selectedItemIdx === null}
            className={`flex gap-2 items-center justify-center rounded-xl px-4 py-2 ${selectedItemIdx === null ? 'bg-neutral-300' : 'bg-main-100'}`}
            onClick={() => setIsOpenBuyModal(true)}
          >
            <RiWallet3Fill className="fill-background" size={20} />
            <p className="font-bold text-[14px]">구입하기</p>
          </button>
        </div>

        <CategoryItemPanel
          items={items}
          selectedItemId={selectedItemIdx}
          onItemSelect={setSelectedItemIdx}
          isShop={true}
        />
      </div>
      {isOpenBuyModal && (
        <ConfirmModal
          isOpen={isOpenBuyModal}
          onConfirm={handleConfirm}
          setIsOpen={setIsOpenBuyModal}
          credit={credit}
          price={selectedItem.price}
          name={selectedItem.name}
        />
      )}
    </div>
  );
}
