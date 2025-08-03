'use client';

import { useState } from 'react';
import { GoCircleSlash } from 'react-icons/go';
import Item from './Item';
import { FaShirt } from 'react-icons/fa6';
import {
  FaHatCowboy,
  FaShoePrints,
  FaClock,
  FaWindowMaximize,
  FaBoxes,
} from 'react-icons/fa';

export default function CategoryItemPanel({
  items,
  selectedItemId,
  onItemSelect,
  isShop,
}) {
  const [selectedCategoryId, onCategorySelect] = useState(1);
  const categoryBtns = [
    { id: 1, name: '의상', icon: FaShirt },
    { id: 2, name: '선반', icon: FaBoxes },
    { id: 3, name: '시계', icon: FaClock },
    { id: 4, name: '창문', icon: FaWindowMaximize },
    { id: 5, name: '모자', icon: FaHatCowboy },
    { id: 6, name: '신발', icon: FaShoePrints },
  ];

  return (
    <div className="flex flex-col overflow-y-auto">
      {/* 탭 영역 */}
      <div className="shrink-0 mt-5 flex gap-2 overflow-x-auto scrollbar-hide px-3">
        {categoryBtns.map(({ id, name, icon: Icon }) => {
          const isActive = id === selectedCategoryId;
          return (
            <button
              key={id}
              onClick={() => onCategorySelect(id)}
              className={`shrink-0 flex gap-2 items-center justify-center rounded-t-lg px-5 py-1.5 min-h-[35px] ${
                isActive ? 'bg-background' : 'bg-neutral-200'
              }`}
            >
              <Icon
                className={`text-xl ${
                  isActive ? 'text-main-100' : 'text-neutral-400'
                }`}
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
      <div className="overflow-y-auto bg-background px-3 pt-3 pb-[80px] grid grid-cols-3 gap-2 scrollbar-hide">
        {/* 선택 안 함 */}
        {!isShop && (
          <Item
            onClick={() => onItemSelect(0)}
            isSelected={selectedItemId === 0}
            icon={GoCircleSlash}
            name="선택안함"
          />
        )}
        {/* 선택된 카테고리 아이템 */}
        {items
          .filter((item) => item.categoryId === selectedCategoryId)
          .map((item) => (
            <Item
              key={item.id}
              onClick={() => onItemSelect(item.id)}
              isSelected={selectedItemId === item.id}
              icon={item.icon}
              name={item.name}
              price={isShop ? item.price : null}
            />
          ))}
      </div>
    </div>
  );
}
