'use client';

import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import { useState } from 'react';
import { FaStore } from 'react-icons/fa';
import Link from 'next/link';
import CategoryItemPanel from '@/app/_components/CategoryItemPanel';
import useUserItems from '@/hooks/decorate/useUserItems';

export default function Decorate() {
  const [selectedItemIdx, setSelectedItemIdx] = useState(null);
  const { items, loading, error } = useUserItems();

  return (
    <div className="flex justify-center h-screen bg-neutral-100">
      <HeaderNavigationBar title="꾸미기" className="bg-background shadow-sm" />
      <div className="flex flex-col max-w-[390px] mx-auto">
        {/* 캐릭터 */}
        <div className="shrink-0 mt-50 flex justify-center">
          <img
            src="/character.png"
            alt="character"
            className="w-[136px] h-[152px]"
          />
        </div>
        <div className="flex justify-end my-3 pr-3">
          <Link href="/shop">
            <div className="flex gap-2 items-center justify-center rounded-xl px-4 py-2 bg-main-100 text-background">
              <FaStore size={20} />
              <p className="font-bold text-[14px]">상점으로</p>
            </div>
          </Link>
        </div>
        {loading ? (
          <div>불러오는중...</div>
        ) : (
          <CategoryItemPanel
            items={items}
            selectedItemId={selectedItemIdx}
            onItemSelect={setSelectedItemIdx}
            isShop={false}
          />
        )}
      </div>
    </div>
  );
}
