'use client';

import { useState, useMemo } from 'react';
import { FaFire } from 'react-icons/fa6';
import { RiWallet3Fill } from 'react-icons/ri';
import ConfirmModal from '@/app/shop/_components/ConfirmModal';
import CategoryItemPanel from '../_components/CategoryItemPanel';
import useItemAll from '@/hooks/shop/useItemAll';
import { useToast } from '../_providers/ToastProvider';
import useMyCredit from '@/hooks/user/useMyCredit';
import { MdChair } from 'react-icons/md';
import Link from 'next/link';
import useEquipItems from '@/hooks/decorate/useEquipItems';
import manifest from '@/data/manifest.json';

const DEFAULT_FLOOR = 39;
const DEFAULT_SHELF = 38;
const DEFAULT_APPAREL = 31;
const DEFAULT_WINDOW = 40;

export default function Shop() {
  const [selectedItemIdx, setSelectedItemIdx] = useState(null);
  const [isOpenBuyModal, setIsOpenBuyModal] = useState(false);
  const [preview, setPreview] = useState({});

  const { items, loading: IALoaing, error: IAError, refetch } = useItemAll();
  const { credit, loading: MYLoading, error: MCError } = useMyCredit();
  const { equip, loading: EILoading, refetch: EIRefetch } = useEquipItems();
  const { show } = useToast();

  const zIndex = manifest.defaults.zIndex;

  const selectedItem = useMemo(
    () => items.find((item) => item.itemId === selectedItemIdx),
    [items, selectedItemIdx]
  );

  const handleSelect = (itemId) => {
    setSelectedItemIdx(itemId);
    const it = items.find((x) => x.itemId === itemId);
    if (!it) return;
    setPreview((prev) => ({ ...prev, [it.itemType]: itemId }));
  };

  const displayIds = {
    FLOOR: preview.FLOOR ?? DEFAULT_FLOOR,
    WALL: preview.WALL ?? null,
    SHELF: preview.SHELF ?? DEFAULT_SHELF,
    OBJECT: preview.OBJECT ?? null,
    WINDOW: preview.WINDOW ?? DEFAULT_WINDOW,
    APPAREL: preview.APPAREL ?? DEFAULT_APPAREL,
  };

  const shopSrc = (id) =>
    id != null ? (manifest.items?.[id]?.asset?.shop ?? null) : null;

  const itemSrc = (id) =>
    id != null ? (manifest.items?.[id]?.asset?.src ?? null) : null;

  return (
    <div className="flex justify-center h-screen pt-21 bg-neutral-100">
      <div className="flex flex-col max-w-[390px] w-screen mx-auto">
        {/* 상단 고정: 보유 포인트 (왼쪽 정렬) */}
        <div className="fixed max-w-[390px] w-screen flex justify-between px-4 z-1">
          <div
            className="flex justify-center items-center gap-2 rounded-lg w-auto px-2 h-8"
            style={{ boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}
          >
            <FaFire className="trnsform scale-x-[-1] text-main-100 w-5 h-5" />
            <p className="font-bold text-main-100 text-lg">
              {MYLoading ? '' : credit}
            </p>
          </div>
          <Link href="/home/decorate">
            <div className="flex flex-col items-center space-y-1">
              <MdChair className="w-6 h-6 text-[#F97316]" />
              <span className="text-xs text-[#F97316]">꾸미기</span>
            </div>
          </Link>
        </div>
        {/* 캐릭터 */}
        <div className="relative flex justify-center max-w-[390px] w-screen h-140">
          {/* FLOOR (shop 이미지) */}
          {shopSrc(displayIds.FLOOR) && (
            <img
              src={shopSrc(displayIds.FLOOR)}
              alt=""
              className={`absolute top-60 z-${zIndex.FLOOR} block`}
            />
          )}
          {/* WALL (shop 이미지) */}
          {shopSrc(displayIds.WALL) && (
            <img
              src={shopSrc(displayIds.WALL)}
              alt=""
              className={`absolute -top-21 z-${zIndex.WALL} block`}
            />
          )}
          {/* SHELF (src 이미지) */}
          {itemSrc(displayIds.SHELF) && (
            <img
              src={itemSrc(displayIds.SHELF)}
              alt=""
              className={`absolute top-12 left-3 w-[90px] h-[237px] z-${zIndex.SHELF} block`}
            />
          )}
          {/* OBJECT */}
          {itemSrc(displayIds.OBJECT) && (
            <img
              src={itemSrc(displayIds.OBJECT)}
              alt=""
              className={`absolute top-44 right-2 w-[90px] h-[110px] z-${zIndex.OBJECT} block`}
            />
          )}
          {/* WINDOW */}
          {itemSrc(displayIds.WINDOW) && (
            <img
              src={itemSrc(displayIds.WINDOW)}
              alt=""
              className={`absolute -top-8 w-[214px] h-[131px] z-${zIndex.WINDOW} block`}
            />
          )}
          {/* APPAREL */}
          {itemSrc(displayIds.APPAREL) && (
            <img
              src={itemSrc(displayIds.APPAREL)}
              alt=""
              className={`absolute top-26 w-[150px] h-[184px] z-${zIndex.APPAREL} block`}
            />
          )}
          <button
            disabled={selectedItemIdx === null}
            className={`absolute z-15 bottom-0 right-2 flex gap-2 items-center justify-center rounded-xl px-4 py-2 text-background ${selectedItemIdx === null || credit - selectedItem.price < 0 ? 'bg-neutral-300' : 'bg-main-100'}`}
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
        <CategoryItemPanel
          items={items}
          selectedItemId={selectedItemIdx}
          onItemSelect={handleSelect}
          isShop={true}
          refetch={EIRefetch}
          equip={equip}
        />
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
