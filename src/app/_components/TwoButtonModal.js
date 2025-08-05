'use client';

export default function TwoButtonModal({
  title,
  description,
  cancelText = '취소',
  confirmText = '확인',
  onCancel,
  onConfirm,
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-center">
      <div className="w-full max-w-[390px] bg-black/30 px-4 flex items-center justify-center">
        <div className="bg-background w-full rounded-xl p-4 text-center shadow-lg">
          <p className="text-base font-semibold mt-3">{title}</p>
          {description && (
            <p className="text-base font-semibold">{description}</p>
          )}
          <div className="flex gap-3 mt-8">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 bg-main-5 text-main-100 font-semibold rounded-md shadow-[0_0_3px_rgba(0,0,0,0.1)]"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 bg-main-100 text-background font-semibold rounded-md"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
