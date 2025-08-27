'use client';

import { useEffect } from 'react';
import { FadeLoader } from 'react-spinners';

export default function LoadingModal({ open }) {
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="min-w-[390px] fixed inset-0 z-[1000] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div className="relative w-30 h-30 flex flex-col items-center justify-center gap-4">
        <FadeLoader color="#35C284" />
      </div>
    </div>
  );
}
