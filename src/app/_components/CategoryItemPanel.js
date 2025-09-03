'use client';

import { useState } from 'react';
import { GoCircleSlash } from 'react-icons/go';
import Item from './Item';
import useEquipItems from '@/hooks/decorate/useEquipItems';
import usePostEquipItem from '@/hooks/decorate/usePostEquipItem';

export default function CategoryItemPanel({
  items,
  selectedItemId,
  onItemSelect,
  isShop,
}) {
  const {
    equip,
    loading: EILoading,
    error: EIError,
    refetch,
  } = useEquipItems();
  const {
    mutate,
    loading: PEILoading,
    error: PEIError,
  } = usePostEquipItem({ onSuccess: () => refetch() });
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

  return (
    <div className="flex flex-col overflow-y-auto">
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
      <div className="overflow-y-auto bg-background h-screen px-3 pt-3 pb-[80px] grid grid-cols-3 content-start gap-2 scrollbar-hide">
        {/* 선택 안 함 */}
        {!isShop && (
          <Item
            onClick={async () => {
              onItemSelect(0);
              const tmp = equip.find((e) => e.itemType === selectedCategoryId);
              if (tmp) await mutate(tmp.itemId);
            }}
            isSelected={
              selectedItemId === 0 ||
              !equip.some((e) => e.itemType === selectedCategoryId)
            }
            Icon={GoCircleSlash}
            name="선택안함"
          />
        )}
        {/* 선택된 카테고리 아이템 */}
        {items
          .filter((item) => item.itemType === selectedCategoryId)
          .map((item) => (
            <Item
              key={item.itemId}
              onClick={async () => {
                onItemSelect(item.itemId);
                console.log(item.itemId);
                await mutate(item.itemId);
              }}
              isSelected={
                selectedItemId === item.itemId ||
                equip.some((e) => e.itemId == item.itemId)
              }
              imageUrl={item.imageUrl}
              name={item.name}
              price={isShop ? item.price : null}
              isOwned={item.isOwned}
            />
          ))}
      </div>
    </div>
  );
}
