'use client';

import { Mail, Brush, Users, Camera, Leaf } from 'lucide-react';
import Link from 'next/link';

export default function HeaderBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 mx-auto max-w-[390px] w-full">
      <div className=" flex justify-between items-start px-4 py-2">
        {/* 왼쪽 포인트 */}
        <div className="flex items-center text-green-600 font-semibold">
          <Leaf className="w-5 h-5 mr-1" />
          <span>70</span>
        </div>

        {/* 오른쪽 기능 버튼들 */}
        <div className="flex flex-col items-center space-y-3 text-green-500 text-sm font-medium">
          <IconButton icon={<Mail className="w-5 h-5" />} label="우편함" />
          <IconButton
            icon={<Brush className="w-5 h-5" />}
            label="꾸미기"
            href="/home/decorate"
          />
          <IconButton icon={<Users className="w-5 h-5" />} label="이웃" />
          <IconButton icon={<Camera className="w-5 h-5" />} label="촬영" />
        </div>
      </div>
    </header>
  );
}

function IconButton({ icon, label, href = '/' }) {
  return (
    <Link href={href}>
      <div className="flex flex-col items-center space-y-1">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
    </Link>
  );
}
