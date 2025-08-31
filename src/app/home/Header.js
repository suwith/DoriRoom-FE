'use client';

import { Mail } from 'lucide-react';
import { MdChair } from 'react-icons/md';
import { FaFire } from 'react-icons/fa6';
import { FaCamera } from 'react-icons/fa';
import Link from 'next/link';

export default function HeaderBar() {
  const userId =
    localStorage.getItem('user_id') || sessionStorage.getItem('user_id');

  return (
    <header className="fixed top-15 left-0 right-0 z-50 mx-auto max-w-[390px] w-full">
      <div className="flex justify-between items-start px-4 py-2">
        {/* 왼쪽 포인트 */}
        <div className="sticky flex z-10">
          <div
            className="flex justify-center items-center gap-1 py-0.5 rounded-lg w-auto px-2"
            style={{ boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}
          >
            <FaFire className="trnsform scale-x-[-1] text-main-100 w-5 h-5" />
            <p className="font-bold text-main-100 text-base">{10}</p>
          </div>
        </div>

        {/* 오른쪽 기능 버튼들 */}
        <div className="flex flex-col items-center space-y-3 text-green-500 text-sm font-medium">
          <IconButton
            icon={<img src="/icons/mailbox.png" className="w-6 h-6" />}
            label="방명록"
            href={`/home/${userId}/guest-book`}
            textColor="text-[#FD6161]"
          />
          <IconButton
            icon={<MdChair className="w-5 h-5 text-[#F36693]" />}
            label="꾸미기"
            href="/home/decorate"
            textColor="text-[#F36693]"
          />
          <IconButton icon={<Mail className="w-5 h-5" />} label="우편함" />
          <IconButton
            icon={<i className="mgc_user_follow_fill text-[#FFBF47] text-xl" />}
            label="이웃"
            textColor="text-[#FFBF47]"
          />
          <IconButton
            icon={<i className="mgc_user_follow_fill text-[#FFBF47] text-xl" />}
            label="랭킹"
            textColor="text-[#FFBF47]"
          />
          <IconButton
            icon={<FaCamera className="w-5 h-5 text-[#7595EA]" />}
            label="촬영"
            textColor="text-[#7595EA]"
          />
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
