'use client';

import { SlOptionsVertical } from 'react-icons/sl';
import OptionModal from './OptionModal';
import { useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import manifest from '@/data/manifest.json';

function formatCreatedAt(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d)) return '';
  const y = String(d.getFullYear()).slice(2);
  const M = String(d.getMonth() + 1).padStart(2, '0');
  const D = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${y}.${M}.${D} ${h}:${m}`;
}

export default function GuestbookEntry({ data, DGMutate, isOwner }) {
  const [isOpen, setIsOpen] = useState(false);

  const user = useAuthStore((s) => s.user);
  const APPARELID =
    data.writerEquippedItems.find((i) => i.itemType === 'APPAREL')?.itemId ??
    31;

  return (
    <div className="flex w-full px-4 gap-8 items-center">
      <div className="w-[25%] text-center">
        <img src={manifest.items?.[APPARELID]?.asset?.guest} className="" />
        <span className="font-semibold text-neutral-900 text-base">
          {data.writerNickname}
        </span>
      </div>
      <div className="relative w-[70%] flex flex-col justify-between bg-background rounded-xl p-3 min-h-25">
        <svg
          className={`absolute top-6 left-1 -translate-x-full overflow-visible`}
          width="15"
          height="10"
          viewBox="0 0 15 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.27637 5.54502C0.311147 5.43615 -0.0143358 4.16996 0.833232 3.69547C4.50001 1.64273 7.72795 0.687522 12.9937 0.173882C13.5756 0.117118 14.0774 0.57778 14.0774 1.16247L14.0774 8.71712C14.0774 9.50677 13.2023 9.98554 12.525 9.57965C8.25372 7.02018 5.22631 5.99056 1.27637 5.54502Z"
            fill="#FEFEFE"
          />
        </svg>
        <div className="flex">
          <p className="flex-1 min-w-0 text-left font-normal text-neutral-900 text-base break-words">
            {data.content}
          </p>
          {(user.userId === data.writerId || isOwner) && (
            <SlOptionsVertical
              className="text-neutral-400"
              onClick={() => setIsOpen(true)}
            />
          )}
        </div>
        <p className="self-end font-normal text-sm text-neutral-400">
          {formatCreatedAt(data?.createdAt)}
        </p>
        <OptionModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          guestbookId={data.guestbookId}
          roomOwnerId={data.roomOwnerId}
          DGMutate={DGMutate}
        />
      </div>
    </div>
  );
}
