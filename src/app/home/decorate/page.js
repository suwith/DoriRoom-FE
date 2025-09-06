'use client';

import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import { useEffect, useState } from 'react';
import { FaStore } from 'react-icons/fa';
import Link from 'next/link';
import CategoryItemPanel from '@/app/_components/CategoryItemPanel';
import useUserItems from '@/hooks/decorate/useUserItems';
import manifest from '@/data/manifest.json';
import LoadingContent from '@/app/_components/LoadingContent';
import useEquipItems from '@/hooks/decorate/useEquipItems';

const DEFAULT_FLOOR = 39;
const DEFAULT_SHELF = 38;
const DEFAULT_APPAREL = 31;

export default function Decorate() {
  const [selectedItemIdx, setSelectedItemIdx] = useState(null);
  const { items, loading: UILoading, error } = useUserItems();
  const { equip, loading: EILoading, refetch } = useEquipItems();
  const zIndex = manifest.defaults.zIndex;

  const selectFLOOR = equip.find((item) => item.itemType === 'FLOOR');
  const selectWALL = equip.find((item) => item.itemType === 'WALL');
  const selectSHELF = equip.find((item) => item.itemType === 'SHELF');
  const selectOBJECT = equip.find((item) => item.itemType === 'OBJECT');
  const selectWINDOW = equip.find((item) => item.itemType === 'WINDOW');
  const selectAPPAREL = equip.find((item) => item.itemType === 'APPAREL');

  if (UILoading) return <LoadingContent loading={UILoading} />;

  return (
    <div className="flex justify-center h-screen bg-neutral-100">
      <HeaderNavigationBar title="꾸미기" className="bg-background shadow-sm" />
      <div className="flex flex-col max-w-[390px] w-screen mx-auto h-[calc(100vh-98px)] mt-[98px]">
        {/* 캐릭터 */}
        <div className="relative flex justify-center max-w-[390px] w-screen h-150">
          {/* FLOOR */}
          <img
            src={
              manifest.items?.[selectFLOOR?.itemId]?.asset?.shop ||
              manifest.items?.[DEFAULT_FLOOR]?.asset?.shop
            }
            className={`absolute top-60 z-${zIndex.FLOOR}`}
          />
          {/* WALL */}
          {selectWALL && (
            <img
              src={manifest.items?.[selectWALL?.itemId]?.asset?.shop}
              className={`absolute -top-21 z-${zIndex.WALL}`}
            />
          )}
          {/* 선반 */}
          <img
            src={
              manifest.items[selectSHELF?.itemId]?.asset?.src ||
              manifest.items?.[DEFAULT_SHELF]?.asset?.src
            }
            className={`absolute top-12 left-3 w-[90px] h-[237px] z-${zIndex.SHELF}`}
          />
          {/* OBJECT */}
          {selectOBJECT && (
            <img
              src={manifest.items[selectOBJECT?.itemId]?.asset?.src}
              className={`absolute top-44 right-2 w-[90px] h-[110px] z-${zIndex.OBJECT}`}
            />
          )}
          {/* WINDOW */}
          {selectWINDOW && (
            <img
              src={manifest.items[selectWINDOW?.itemId]?.asset?.src}
              className={`absolute -top-8 w-[214px] h-[131px] z-${zIndex.WINDOW}`}
            />
          )}
          {/* APPAREL */}
          <img
            src={
              manifest.items[selectAPPAREL?.itemId]?.asset?.src ||
              manifest.items?.[DEFAULT_APPAREL]?.asset?.src
            }
            className={`absolute top-25 w-[150px] h-[184px] z-${zIndex.APPAREL}`}
          />
          <Link href="/shop" className="absolute bottom-0 right-2">
            <div className="flex gap-2 items-center justify-center rounded-xl px-4 py-2 bg-main-100 text-background">
              <FaStore size={20} />
              <p className="font-bold text-[14px]">상점으로</p>
            </div>
          </Link>
        </div>
        <CategoryItemPanel
          items={items}
          selectedItemId={selectedItemIdx}
          onItemSelect={setSelectedItemIdx}
          isShop={false}
          equip={equip}
          onEquipped={refetch}
        />
      </div>
    </div>
  );
}
