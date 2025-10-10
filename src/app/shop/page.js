'use client';

import { useState, useMemo, useRef } from 'react';
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
import LoadingContent from '../_components/LoadingContent';

const DEFAULT_FLOOR = 39;
const DEFAULT_SHELF = 38;
const DEFAULT_APPAREL = 31;
const DEFAULT_WINDOW = 40;

export default function Shop() {
  const [selectedItemIdx, setSelectedItemIdx] = useState(null);
  const [isOpenBuyModal, setIsOpenBuyModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState('APPAREL');
  const [preview, setPreview] = useState({});

  const { items, loading: IALoaing, error: IAError, refetch } = useItemAll();
  const {
    credit,
    loading: MYLoading,
    error: MCError,
    refetch: MCRefetch,
  } = useMyCredit();
  const { equip, loading: EILoading, refetch: EIRefetch } = useEquipItems();
  const { show } = useToast();

  const [wallH, setWallH] = useState(0);
  const [floorH, setFloorH] = useState(0);
  const wallRef = useRef(null);
  const floorRef = useRef(null);

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

  const byType = Object.fromEntries(equip.map((it) => [it.itemType, it]));

  const displayIds = {
    FLOOR: preview.FLOOR ?? byType.FLOOR?.itemId ?? DEFAULT_FLOOR,
    WALL: preview.WALL ?? byType.WALL?.itemId ?? null,
    SHELF: preview.SHELF ?? byType.SHELF?.itemId ?? DEFAULT_SHELF,
    OBJECT: preview.OBJECT ?? byType.OBJECT?.itemId ?? null,
    WINDOW: preview.WINDOW ?? byType.WINDOW?.itemId ?? DEFAULT_WINDOW,
    APPAREL: preview.APPAREL ?? byType.APPAREL?.itemId ?? DEFAULT_APPAREL,
  };

  const DEFAULT_H = displayIds.WALL ? wallH : 300;

  const shopSrc = (id) =>
    id != null ? (manifest.items?.[id]?.asset?.shop ?? null) : null;

  const itemSrc = (id) =>
    id != null ? (manifest.items?.[id]?.asset?.src ?? null) : null;

  if (IALoaing) return <LoadingContent loading={IALoaing} />;
  return (
    <div className="flex justify-center h-screen bg-neutral-100">
      <div className="flex flex-col w-screen mx-auto">
        {/* 상단 고정: 보유 포인트 (왼쪽 정렬) */}
        <div className="fixed w-screen flex justify-between px-4 z-20 appbar-padding-t">
          <div
            className="flex justify-center items-center gap-2 rounded-lg w-auto px-2 h-8 bg-background"
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
        <div
          className="relative flex justify-center w-screen"
          style={{
            minHeight: DEFAULT_H + floorH - 35,
          }}
        >
          {/* FLOOR (shop 이미지) */}
          {shopSrc(displayIds.FLOOR) && (
            <img
              ref={floorRef}
              src={shopSrc(displayIds.FLOOR)}
              alt=""
              className={`absolute block w-full`}
              style={{
                zIndex: zIndex.FLOOR,
                top: DEFAULT_H,
              }}
              onLoad={(e) => setFloorH(e.currentTarget.clientHeight)} // 렌더된 높이
            />
          )}
          {/* WALL (shop 이미지) */}
          {shopSrc(displayIds.WALL) && (
            <img
              ref={wallRef}
              src={shopSrc(displayIds.WALL)}
              alt=""
              className={`absolute top-0 block w-full`}
              style={{ zIndex: zIndex.WALL }}
              onLoad={(e) => setWallH(e.currentTarget.clientHeight)} // 렌더된 높이
            />
          )}
          {/* SHELF (src 이미지) */}
          {itemSrc(displayIds.SHELF) && (
            <img
              src={itemSrc(displayIds.SHELF)}
              alt=""
              className={`absolute left-3 w-[90px] h-[237px] block`}
              style={{ zIndex: zIndex.SHELF, top: DEFAULT_H - 190 }}
            />
          )}
          {/* OBJECT */}
          {itemSrc(displayIds.OBJECT) && (
            <img
              src={itemSrc(displayIds.OBJECT)}
              alt=""
              className={`absolute right-2 w-[90px] h-[110px] block`}
              style={{ zIndex: zIndex.OBJECT, top: DEFAULT_H - 70 }}
            />
          )}
          {/* WINDOW */}
          {itemSrc(displayIds.WINDOW) && (
            <img
              src={itemSrc(displayIds.WINDOW)}
              alt=""
              className={`absolute w-[214px] h-[131px] block`}
              style={{ zIndex: zIndex.WINDOW, top: DEFAULT_H - 290 }}
            />
          )}
          {/* APPAREL */}
          {itemSrc(displayIds.APPAREL) && (
            <img
              src={itemSrc(displayIds.APPAREL)}
              alt=""
              className={`absolute w-[150px] h-[184px] block`}
              style={{ zIndex: zIndex.APPAREL, top: DEFAULT_H - 140 }}
            />
          )}
          <button
            disabled={selectedItemIdx === null}
            className={`absolute z-15 bottom-2 right-2 flex gap-2 items-center justify-center rounded-xl px-4 py-2 text-background ${selectedItemIdx === null || credit - selectedItem.price < 0 ? 'bg-neutral-300' : 'bg-main-100'}`}
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
          onEquipped={EIRefetch}
          equip={equip}
          selectedCategoryId={selectedCategoryId}
          setSelectedCategoryId={setSelectedCategoryId}
        />
      </div>
      {isOpenBuyModal && (
        <ConfirmModal
          isOpen={isOpenBuyModal}
          setIsOpen={setIsOpenBuyModal}
          itemId={selectedItemIdx}
          refetch={refetch}
          MCRefetch={MCRefetch}
        />
      )}
    </div>
  );
}
