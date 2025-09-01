// app/_providers/AuthBootstrap.jsx
'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axiosInstance';

function getStoredTokens() {
  if (typeof window === 'undefined') return null;
  const la = localStorage.getItem('access_token');
  const lr = localStorage.getItem('refresh_token');
  const sa = sessionStorage.getItem('access_token');
  const sr = sessionStorage.getItem('refresh_token');
  if ((la && lr) || (sa && sr)) return { accessToken: la || sa };
  return null;
}

export default function AuthBootstrap({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const isAuthPage =
      pathname?.startsWith('/login') ||
      pathname?.startsWith('/signup');

    const tokens = getStoredTokens();

    if (tokens?.accessToken) {
      axiosInstance.defaults.headers.Authorization = `Bearer ${tokens.accessToken}`;
      if (mounted) setReady(true);
      return;
    }

    if (!isAuthPage) {
      router.replace('/auth');
      if (mounted) setReady(true);
      return;
    }

    if (mounted) setReady(true);
    return () => { mounted = false; };
  }, [pathname, router]);

  if (!ready) return null;
  return children;
}
