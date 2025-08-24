'use client';

import { useState } from 'react';
import { FaFire } from 'react-icons/fa6';
import { RiWallet3Fill } from 'react-icons/ri';
import ConfirmModal from '@/app/shop/_components/ConfirmModal';
import CategoryItemPanel from '../_components/CategoryItemPanel';
import useItemAll from '@/hooks/shop/useItemAll';
import { useToast } from '../_providers/ToastProvider';

export default function Shop() {
  const [selectedItemIdx, setSelectedItemIdx] = useState(null);
  const [isOpenBuyModal, setIsOpenBuyModal] = useState(false);
  const { items, loading, error, refetch } = useItemAll();
  const { show } = useToast();

  // 유저가 가지고 있는 크레딧
  const credit = 0;

  const selectedItem = items.find((item) => item.itemId === selectedItemIdx);

  return (
    <div className="flex justify-center h-screen pt-[30px] bg-neutral-100">
      <div className="flex flex-col max-w-[390px] w-screen mx-auto">
        {/* 상단 고정: 보유 포인트 (왼쪽 정렬) */}
        <div className="sticky flex top-0 z-10 pt-4 pb-2 pl-3">
          <div
            className="flex justify-center items-center gap-2 rounded-lg w-auto px-2"
            style={{ boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}
          >
            <FaFire className="trnsform scale-x-[-1] text-main-100 w-5 h-5" />
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
            className={`flex gap-2 items-center justify-center rounded-xl px-4 py-2 ${selectedItemIdx === null || credit - selectedItem.price < 0 ? 'bg-neutral-300' : 'bg-main-100'}`}
            onClick={() => {
              if (credit - selectedItem.price >= 0) setIsOpenBuyModal(true);
              else
                show({
                  message: '앗, 도깨비불이 부족해서 구입할 수 없어요!',
                });
            }}
          >
            <RiWallet3Fill className="fill-background" size={20} />
            <p className="font-bold text-[14px]">구입하기</p>
          </button>
        </div>
        {loading ? (
          <div>불러오는중...</div>
        ) : (
          <CategoryItemPanel
            items={items}
            selectedItemId={selectedItemIdx}
            onItemSelect={setSelectedItemIdx}
            isShop={true}
          />
        )}
      </div>
      {isOpenBuyModal && (
        <ConfirmModal
          isOpen={isOpenBuyModal}
          setIsOpen={setIsOpenBuyModal}
          itemId={selectedItemIdx}
          refetch={refetch}
        />
      )}
    </div>
  );
}
