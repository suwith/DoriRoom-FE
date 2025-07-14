// components/ConfirmModal.js
'use client';

export default function ConfirmModal({
  isOpen,
  onConfirm,
  setIsOpen,
  message,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="flex flex-col gap-4 bg-white rounded-lg shadow-lg w-[25%] max-w-sm px-10 py-6 animate-fade-in">
        <p className="text-center text-gray-800 text-lg font-medium">
          {message}
        </p>
        <p className="text-center text-neutral-500 font-regular text-[14px]">
          남은 잎사귀 7개
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
