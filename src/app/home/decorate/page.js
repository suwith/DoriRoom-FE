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
const DEFAULT_WINDOW = 40;

export default function Decorate() {
  const [selectedItemIdx, setSelectedItemIdx] = useState(null);
  const { items, loading: UILoading, error } = useUserItems();
  const { equip, loading: EILoading, refetch } = useEquipItems();
  const zIndex = manifest.defaults.zIndex;

  const byType = Object.fromEntries(equip.map((it) => [it.itemType, it]));
  const selectFLOOR = byType.FLOOR;
  const selectWALL = byType.WALL;
  const selectSHELF = byType.SHELF;
  const selectOBJECT = byType.OBJECT;
  const selectWINDOW = byType.WINDOW;
  const selectAPPAREL = byType.APPAREL;

  if (UILoading) return <LoadingContent loading={UILoading} />;

  return (
    <div className="flex justify-center h-screen bg-neutral-100 pt-[95px]">
      <HeaderNavigationBar title="꾸미기" className="bg-background shadow-sm" />
      <div className="flex flex-col w-screen mx-auto">
        <div className="relative flex justify-center w-screen min-h-76">
          {/* FLOOR */}
          <img
            src={
              manifest.items?.[selectFLOOR?.itemId]?.asset?.shop ||
              manifest.items?.[DEFAULT_FLOOR]?.asset?.shop
            }
            className={`absolute top-60 w-full`}
            style={{ zIndex: zIndex.FLOOR }}
          />
          {/* WALL */}
          {selectWALL && (
            <img
              src={manifest.items?.[selectWALL?.itemId]?.asset?.shop}
              className={`absolute -top-21 w-full`}
              style={{ zIndex: zIndex.WALL }}
            />
          )}
          {/* 선반 */}
          <img
            src={
              manifest.items[selectSHELF?.itemId]?.asset?.src ||
              manifest.items?.[DEFAULT_SHELF]?.asset?.src
            }
            className={`absolute top-12 left-3 w-[90px] h-[237px]`}
            style={{ zIndex: zIndex.SHELF }}
          />
          {/* OBJECT */}
          {selectOBJECT && (
            <img
              src={manifest.items[selectOBJECT?.itemId]?.asset?.src}
              className={`absolute top-44 right-2 w-[90px] h-[110px]`}
              style={{ zIndex: zIndex.OBJECT }}
            />
          )}
          {/* WINDOW */}
          <img
            src={
              manifest.items[selectWINDOW?.itemId]?.asset?.src ||
              manifest.items[DEFAULT_WINDOW]?.asset?.src
            }
            className={`absolute -top-6 w-[214px] h-[131px]`}
            style={{ zIndex: zIndex.WINDOW }}
          />
          {/* APPAREL */}
          <img
            src={
              manifest.items[selectAPPAREL?.itemId]?.asset?.src ||
              manifest.items?.[DEFAULT_APPAREL]?.asset?.src
            }
            className={`absolute top-25 w-[150px] h-[184px]`}
            style={{ zIndex: zIndex.APPAREL }}
          />
          <Link href="/shop" className="absolute bottom-0 right-2 z-15">
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
