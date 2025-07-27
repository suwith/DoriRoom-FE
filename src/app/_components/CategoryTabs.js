'use client';

import { FaShirt } from 'react-icons/fa6';
import {
  FaHatCowboy,
  FaShoePrints,
  FaClock,
  FaWindowMaximize,
  FaBoxes,
} from 'react-icons/fa';

export default function CategoryTabs({ selectedId, onSelect }) {
  const categoryBtns = [
    { id: 1, name: '의상', icon: FaShirt },
    { id: 2, name: '선반', icon: FaBoxes },
    { id: 3, name: '시계', icon: FaClock },
    { id: 4, name: '창문', icon: FaWindowMaximize },
    { id: 5, name: '모자', icon: FaHatCowboy },
    { id: 6, name: '신발', icon: FaShoePrints },
  ];

  return (
    <div className="shrink-0 flex gap-2 px-2 overflow-x-auto scrollbar-hide">
      {categoryBtns.map(({ id, name, icon: Icon }) => {
        const isActive = selectedId === id;

        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`shrink-0 flex gap-2 items-center justify-center rounded-t-lg px-5 py-1.5 min-h-[35px] ${
              isActive ? 'bg-white' : 'bg-neutral-200'
            }`}
          >
            <Icon
              className={`text-xl ${
                isActive ? 'text-emerald-400' : 'text-neutral-400'
              }`}
            />
            <p
              className={`text-sm font-medium whitespace-nowrap ${
                isActive ? 'text-emerald-400' : 'text-neutral-400'
              }`}
            >
              {name}
            </p>
          </button>
        );
      })}
    </div>
  );
}
