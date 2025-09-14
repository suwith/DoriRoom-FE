'use client';

import React from 'react';

export default function BottomSheet({
  open,
  title,
  onClose,
  children,
  footer,
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0">
      <div
        className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 w-screen mx-auto bg-background rounded-t-xl pt-5 appbar-padding-b ${
          title === '지역' ? '' : 'px-4'
        }`}
      >
        <div
          className={`flex items-center justify-between mb-6 ${
            title === '지역' ? 'px-4' : ''
          }`}
        >
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="p-1"></button>
          <button
            onClick={onClose}
            className="bg-main-5 text-main-100 rounded-full w-5 h-5 p-1 text-xs"
          >
            <i className="mgc_close_line" />
          </button>
        </div>
        <div className="max-h-[55vh] overflow-auto">{children}</div>
        {footer ? <div className="mt-3">{footer}</div> : null}
      </div>
    </div>
  );
}
