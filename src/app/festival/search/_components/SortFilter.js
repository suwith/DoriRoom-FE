'use client';

import BottomSheet from './BottomSheet';

const OPTIONS = ['추천순', '최신순', '좋아요순'];

export default function SortFilter({ open, onClose, value, onChange }) {
  return (
    <BottomSheet open={open} onClose={onClose} title="정렬">
      <div className="space-y-2 pb-6">
        {OPTIONS.map((o) => {
          const active = value === o;
          return (
            <button
              key={o}
              onClick={() => {
                onChange(o);
                onClose();
              }}
              className={`flex justify-between items-center w-full text-left px-4 py-3 rounded-lg ${active ? 'bg-main-5 text-main-100' : 'bg-neutral-100 text-neutral-600'}`}
            >
              {o}
              {active && <i className="mgc_check_fill text-main-100 text-xl" />}
            </button>
          );
        })}
      </div>
    </BottomSheet>
  );
}
