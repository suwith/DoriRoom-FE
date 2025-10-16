'use client';

import { MdChair } from 'react-icons/md';
import { FaFire } from 'react-icons/fa6';
import { FaCamera } from 'react-icons/fa';
import Link from 'next/link';
import { useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';

export default function HeaderBar({ credit }) {
  const [isOpenTogggle, setIsOpenToggle] = useState(false);
  const user = useAuthStore((e) => e.user);

  return (
    <header className="fixed appbar-padding-t left-0 right-0 z-50 mx-auto w-full">
      <div className="flex justify-between items-start px-4 py-2">
        {/* 왼쪽 포인트 */}
        <div className="sticky flex z-10">
          <div
            className="flex justify-center items-center gap-1 py-0.5 rounded-lg w-auto px-2 bg-background"
            style={{ boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}
          >
            <FaFire className="trnsform scale-x-[-1] text-main-100 w-5 h-5" />
            <p className="font-bold text-main-100 text-base">{credit}</p>
          </div>
        </div>

        {/* 오른쪽 기능 버튼들 */}
        <div
          className="flex flex-col items-center space-y-4 text-green-500 text-sm font-medium rounded-lg overflow-y-hidden px-4 pt-3 pb-2 bg-background"
          style={{ boxShadow: '0 0 3px rgba(0,0,0,0.1)' }}
        >
          <IconButton
            icon={<img src="/icons/mailbox.png" className="w-5 h-5" />}
            label="방명록"
            href={`/home/${user.userId}/guest-book`}
            textColor="text-[#FD6161]"
          />
          <IconButton
            icon={<i className="mgc_user_follow_fill text-[#F36693] text-xl" />}
            label="이웃"
            href="/neighbor"
            textColor="text-[#F36693]"
          />
          <IconButton
            icon={<MdChair className="w-5 h-5 text-[#F97316]" />}
            label="꾸미기"
            href="/home/decorate"
            textColor="text-[#F97316]"
          />
          <div
            className={`w-full overflow-hidden transition-all duration-500 ${isOpenTogggle ? 'max-h-40' : 'max-h-0'}`}
          >
            <div className="flex flex-col items-center space-y-4">
              <IconButton
                icon={<i className="mgc_mail_fill text-[#FFBF47] text-xl" />}
                label="알림"
                textColor="text-[#FFBF47]"
                href="/home/alert"
              />
              <IconButton
                icon={<i className="mgc_award_fill text-sub2-100 text-xl" />}
                label="랭킹"
                href="/ranking"
                textColor="text-sub2-100"
              />
              <IconButton
                icon={<FaCamera className="w-4 h-4 text-[#7595EA]" />}
                label="촬영"
                href="/home/capture"
                textColor="text-[#7595EA]"
              />
            </div>
          </div>
          <button
            className="inline-block"
            onClick={() => setIsOpenToggle((prev) => !prev)}
          >
            <i
              className={`mgc_down_line text-neutral-300 text-2xl block transform transition-transform duration-300 ease-in-out ${isOpenTogggle ? 'rotate-180' : 'rotate-0'}`}
            />
          </button>
        </div>
      </div>
    </header>
  );
}

function IconButton({ icon, label, href = '/', textColor }) {
  return (
    <Link href={href}>
      <div className="flex flex-col items-center space-y-1">
        {icon}
        <span className={`text-xs ${textColor}`}>{label}</span>
      </div>
    </Link>
  );
}
