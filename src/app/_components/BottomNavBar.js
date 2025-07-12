'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: '홈' },
  { href: '/shop', label: '상점' },
  { href: '/festival', label: '축제' },
  { href: '/collection', label: '도감' },
  { href: '/mypage', label: '마이' },
  { href: '/reward', label: '테스트' },
];

export default function BottomNavBar() {
  const pathname = usePathname();

  return (
    <nav className="max-w-[390px] w-full h-18 border-t flex justify-around items-center bg-white fixed bottom-0 z-50">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`text-xs flex flex-col items-center ${
            pathname === item.href
              ? 'text-green-600 font-semibold'
              : 'text-gray-400'
          }`}
        >
          {/* 아이콘은 추후 적용 */}
          <div className="w-5 h-5 bg-gray-300 mb-1 rounded" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
