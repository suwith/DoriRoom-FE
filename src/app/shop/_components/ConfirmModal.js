// components/ConfirmModal.js
'use client';

export default function ConfirmModal({
  isOpen,
  onConfirm,
  setIsOpen,
  credit,
  price,
  name,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/30">
      <div className="flex flex-col gap-4 bg-white rounded-lg shadow-lg w-[80%] max-w-sm px-10 py-6 animate-fade-in">
        <p className="text-center text-gray-800 text-lg font-medium">
          {price} 도깨비불로 {name}을(를) 구매하시겠습니까?
        </p>
        <p className="text-center text-neutral-500 font-regular text-[14px]">
          남은 잎사귀 {credit}개
        </p>
        <div className="flex justify-between gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 py-2 bg-emerald-500 text-white font-semibold rounded-md"
          >
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
  );
}
