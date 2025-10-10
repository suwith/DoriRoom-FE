'use client';

import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import { useState, useRef } from 'react';
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
  const [selectedCategoryId, setSelectedCategoryId] = useState('APPAREL');
  const { items, loading: UILoading, error } = useUserItems();
  const { equip, loading: EILoading, refetch } = useEquipItems();
  const zIndex = manifest.defaults.zIndex;

  const [wallH, setWallH] = useState(0);
  const [floorH, setFloorH] = useState(0);
  const wallRef = useRef(null);
  const floorRef = useRef(null);

  const byType = Object.fromEntries(equip.map((it) => [it.itemType, it]));
  const selectFLOOR = byType.FLOOR;
  const selectWALL = byType.WALL;
  const selectSHELF = byType.SHELF;
  const selectOBJECT = byType.OBJECT;
  const selectWINDOW = byType.WINDOW;
  const selectAPPAREL = byType.APPAREL;

  const DEFAULT_H = selectWALL ? wallH : 300;

  if (UILoading) return <LoadingContent loading={UILoading} />;

  return (
    <div className="flex justify-center h-screen bg-neutral-100">
      <HeaderNavigationBar title="꾸미기" className="bg-background shadow-sm" />
      <div className="flex flex-col w-screen mx-auto">
        <div
          className="relative flex justify-center w-screen" // min-h-[420px]
          style={{
            minHeight: DEFAULT_H + floorH - 35,
          }}
        >
          {/* FLOOR */}
          <img
            ref={floorRef}
            src={
              manifest.items?.[selectFLOOR?.itemId]?.asset?.shop ||
              manifest.items?.[DEFAULT_FLOOR]?.asset?.shop
            }
            className={`absolute w-full`}
            style={{ zIndex: zIndex.FLOOR, top: DEFAULT_H }}
            onLoad={(e) => setFloorH(e.currentTarget.clientHeight)} // 렌더된 높이
          />
          {/* WALL */}
          {selectWALL && (
            <img
              ref={wallRef}
              src={manifest.items?.[selectWALL?.itemId]?.asset?.shop}
              className={`absolute top-0 w-full`}
              style={{ zIndex: zIndex.WALL }}
              onLoad={(e) => setWallH(e.currentTarget.clientHeight)} // 렌더된 높이
            />
          )}
          {/* 선반 */}
          <img
            src={
              manifest.items[selectSHELF?.itemId]?.asset?.src ||
              manifest.items?.[DEFAULT_SHELF]?.asset?.src
            }
            className={`absolute left-3 w-[90px] h-[237px]`}
            style={{ zIndex: zIndex.SHELF, top: DEFAULT_H - 180 }}
          />
          {/* OBJECT */}
          {selectOBJECT && (
            <img
              src={manifest.items[selectOBJECT?.itemId]?.asset?.src}
              className={`absolute right-2 w-[90px] h-[110px]`}
              style={{ zIndex: zIndex.OBJECT, top: DEFAULT_H - 70 }}
            />
          )}
          {/* WINDOW */}
          <img
            src={
              manifest.items[selectWINDOW?.itemId]?.asset?.src ||
              manifest.items[DEFAULT_WINDOW]?.asset?.src
            }
            className={`absolute w-[214px] h-[131px]`}
            style={{ zIndex: zIndex.WINDOW, top: DEFAULT_H - 280 }}
          />
          {/* APPAREL */}
          <img
            src={
              manifest.items[selectAPPAREL?.itemId]?.asset?.src ||
              manifest.items?.[DEFAULT_APPAREL]?.asset?.src
            }
            className={`absolute w-[150px] h-[184px]`}
            style={{ zIndex: zIndex.APPAREL, top: DEFAULT_H - 130 }}
          />
          <Link href="/shop" className="absolute bottom-2 right-2 z-15">
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
          selectedCategoryId={selectedCategoryId}
          setSelectedCategoryId={setSelectedCategoryId}
        />
      </div>
    </div>
  );
}
