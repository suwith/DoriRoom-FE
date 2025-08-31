'use client';

import UserProfile from './_components/UserProfile';
import Link from 'next/link';
import TwoButtonModal from '../_components/TwoButtonModal';
import { useState } from 'react';

export default function Mypage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col h-full max-w-[390px] w-screen h-screen">
      <div className="flex-2 flex items-center justify-center bg-main-5 px-4">
        <UserProfile />
      </div>
      <div className="flex-3 flex flex-col divide-y-2 divide-neutral-100">
        <IconButton
          icon={<i className="mgc_pin_fill text-main-100 text-xl" />}
          label="공지사항"
          textColor="text-neutral-900"
        />
        <IconButton
          icon={<i className="mgc_pen_fill text-main-100 text-xl" />}
          label="이용약관"
          textColor="text-neutral-900"
        />
        <IconButton
          icon={<i className="mgc_entrance_fill text-main-100 text-xl" />}
          label="로그아웃"
          textColor="text-neutral-900"
        />
        <div
          className="flex items-center space-x-2 py-3 px-4"
          onClick={() => setIsOpen(true)}
        >
          <i className="mgc_delete_2_fill text-main-100 text-xl" />
          <span className="text-sm font-normal text-neutral-900">탈퇴하기</span>
        </div>
      </div>
      {isOpen && (
        <TwoButtonModal
          description={
            <>
              앗, 탈퇴하면 모든 데이터가 사라져요!
              <br />
              정말 탈퇴하시겠어요?
            </>
          }
          cancelText="취소할래요"
          confirmText="네, 탈퇴할래요"
          onCancel={() => setIsOpen(false)}
          onConfirm={() => {
            console.log('탈퇴됨');
            setIsOpen(false);
          }}
        />
      )}
    </div>
  );
}

function IconButton({ icon, label, href = '/', textColor }) {
  return (
    <Link href={href}>
      <div className="flex items-center space-x-2 py-3 px-4">
        {icon}
        <span className={`text-sm font-normal ${textColor}`}>{label}</span>
      </div>
    </Link>
  );
}
