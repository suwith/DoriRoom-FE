'use client';

import { useState } from 'react';
import Item from './Item';
import usePostEquipItem from '@/hooks/decorate/usePostEquipItem';
import manifest from '@/../public/manifest.json' assert { type: 'json' };

const DEFAULT = {
  FLOOR: 39,
  SHELF: 38,
  APPAREL: 31,
};

export default function CategoryItemPanel({
  items,
  selectedItemId,
  onItemSelect,
  isShop,
  equip,
  onEquipped,
}) {
  const {
    mutate,
    loading: PEILoading,
    error: PEIError,
  } = usePostEquipItem({
    onSuccess: () => {
      onEquipped();
    },
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState('APPAREL');
  const categoryBtns = [
    { id: 1, name: '의상', type: 'APPAREL', icon: 'mgc_t_shirt_fill' },
    {
      id: 2,
      name: '소품',
      type: 'OBJECT',
      icon: 'mgc_toy_horse_fill',
    },
    { id: 3, name: '선반', type: 'SHELF', icon: 'mgc_layout_5_fill' },
    { id: 4, name: '창문', type: 'WINDOW', icon: 'mgc_curtain_fill' },
    { id: 5, name: '벽지', type: 'WALL', icon: 'mgc_paint_2_fill' },
    { id: 6, name: '바닥', type: 'FLOOR', icon: 'mgc_map_2_fill' },
  ];

  console.log(DEFAULT[selectedCategoryId]);
  return (
    <div className="flex flex-col overflow-y-auto z-15">
      {/* 탭 영역 */}
      <div className="shrink-0 mt-5 flex gap-2 overflow-x-auto scrollbar-hide px-3">
        {categoryBtns.map(({ id, name, type, icon }) => {
          const isActive = type === selectedCategoryId;
          return (
            <button
              key={id}
              onClick={() => setSelectedCategoryId(type)}
              className={`shrink-0 flex gap-2 items-center justify-center rounded-t-lg px-5 py-1.5 min-h-[35px] ${
                isActive ? 'bg-background' : 'bg-neutral-200'
              }`}
            >
              <i
                className={`${icon} text-xl ${isActive ? 'text-main-100' : 'text-neutral-400'}`}
              />
              <p
                className={`text-sm font-medium whitespace-nowrap ${
                  isActive ? 'text-main-100' : 'text-neutral-400'
                }`}
              >
                {name}
              </p>
            </button>
          );
        })}
      </div>

      {/* 아이템 리스트 */}
      <div className="overflow-y-auto bg-background h-screen px-3 pt-6 pb-[80px] grid grid-cols-3 content-start gap-2 scrollbar-hide">
        {/* 선택 안 함 */}
        {!isShop &&
          (['APPAREL', 'SHELF', 'WINDOW'].includes(selectedCategoryId) ? (
            <Item
              onClick={async () => {
                onItemSelect(0);
                const tmp = equip.find(
                  (e) => e.itemType === selectedCategoryId
                );
                if (tmp) await mutate(tmp.itemId);
              }}
              isSelected={
                selectedItemId === 0 ||
                !equip.some((e) => e.itemType === selectedCategoryId)
              }
              imageUrl={
                manifest.items?.[DEFAULT[selectedCategoryId]]?.asset.thumb
              }
              name={manifest.items?.[DEFAULT[selectedCategoryId]]?.name}
            />
          ) : (
            <Item
              onClick={async () => {
                onItemSelect(0);
                const tmp = equip.find(
                  (e) => e.itemType === selectedCategoryId
                );
                if (tmp) await mutate(tmp.itemId);
              }}
              isSelected={
                selectedItemId === 0 ||
                !equip.some((e) => e.itemType === selectedCategoryId)
              }
              name="선택안함"
            />
          ))}
        {/* 선택된 카테고리 아이템 */}
        {items
          .filter((item) => item.itemType === selectedCategoryId)
          .map((item) => (
            <Item
              key={item.itemId}
              onClick={async () => {
                if (selectedItemId === item.itemId) return;
                onItemSelect(item.itemId);
                await mutate(item.itemId);
              }}
              isSelected={
                selectedItemId === item.itemId ||
                equip.some((e) => e.itemId == item.itemId)
              }
              imageUrl={manifest.items?.[item.itemId]?.asset.thumb}
              name={item.name}
              price={isShop ? item.price : null}
              isOwned={item.isOwned}
            />
          ))}
      </div>
    </div>
  );
}
