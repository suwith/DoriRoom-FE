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

  const HIDDEN_PATHS = [
    '/home/decorate',
    '/home/alert',
    '/festival/search/',
    '/festival/bookmarks/',
    '/login',
    '/home/capture',
  ];

  const HIDDEN_PREFIXES = [
    '/festival/search/result',
    '/diary',
    '/signup/',
    '/auth',
    '/mypage/',
    '/neighbor',
    '/ranking',
  ];

  const shouldHide =
    HIDDEN_PATHS.includes(pathname) ||
    (pathname.startsWith('/festival') &&
      pathname !== '/festival' &&
      pathname !== '/festival/') ||
    (/^\/collection\/.+/.test(pathname) && pathname !== '/collection') ||
    pathname.endsWith('/guest-book') ||
    HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (shouldHide) return null;

  return (
    <nav className="w-full h-18 flex justify-around items-center bg-background fixed bottom-0 z-50 shadow-[0_-2px_4px_rgba(0,0,0,0.08)]">
      {navItems.map(({ href, label, iconClass }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`);
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
