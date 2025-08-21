'use client';

import usePurchaseInfo from '@/hooks/shop/usePurchaseInfo';

export default function ConfirmModal({ isOpen, setIsOpen, itemId }) {
  const { items, loading, error } = usePurchaseInfo(itemId);

  if (!isOpen) return null;

  if (loading) return;

  return (
    <div className="fixed inset-0 z-50 flex justify-center">
      <div className="w-full max-w-[390px] bg-black/30 px-4 flex items-center justify-center">
        <div className="flex flex-col gap-4 bg-white rounded-lg shadow-lg w-[90%] max-w-sm px-10 py-6 animate-fade-in">
          <p className="text-center text-gray-800 text-base font-semibold">
            {items.price} 도깨비불로 {items.name}을(를) 구매하시겠습니까?
          </p>
          <p className="text-center text-neutral-500 font-regular text-[13px] mb-2 ">
            남은 도깨비불 : {items.remainingCredit}개
          </p>
          <div className="flex justify-between gap-3">
            <button className="flex-1 py-2 bg-emerald-500 text-white font-semibold rounded-md">
              네
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 py-2 bg-emerald-500/5 text-emerald-500 font-semibold rounded-md"
            >
              아니요
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
