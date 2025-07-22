'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import 'mingcute_icon/font/Mingcute.css';

const iconClasses = [
  'mgc_home_7_fill',
  'mgc_store_2_fill',
  'mgc_firework_fill',
  'mgc_notebook_2_fill',
  'mgc_user_2_fill',
];

const navItems = [
  { href: '/', label: '홈' },
  { href: '/shop', label: '상점' },
  { href: '/festival', label: '축제' },
  { href: '/collection', label: '도감' },
  { href: '/mypage', label: '마이' },
].map((item, index) => ({
  ...item,
  iconClass: iconClasses[index],
}));

export default function BottomNavBar() {
  const pathname = usePathname();

  return (
    <nav className="max-w-[390px] w-full h-18 flex justify-around items-center bg-white fixed bottom-0 z-50 shadow-[0_-2px_4px_rgba(0,0,0,0.08)]">
      {navItems.map(({ href, label, iconClass }) => {
        const isActive = pathname === href;
        const color = isActive ? 'var(--color-main-100)' : '#A3A3A3';

        return (
          <Link
            key={href}
            href={href}
            className="text-xs flex flex-col items-center"
          >
            <i className={`${iconClass} text-2xl`} style={{ color }} />
            <span
              className={`mt-1 ${
                isActive ? 'text-main-100 font-semibold' : 'text-neutral-400'
              }`}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
