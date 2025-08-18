'use client';

import { useEffect, useState } from 'react';
import useSignIn from '@/hooks/auth/useSignIn';

function hasTokens() {
  if (typeof window === 'undefined') return false;
  const la = localStorage.getItem('access_token');
  const lr = localStorage.getItem('refresh_token');
  const sa = sessionStorage.getItem('access_token');
  const sr = sessionStorage.getItem('refresh_token');
  return (la && lr) || (sa && sr);
}

export default function AuthBootstrap({ children }) {
  const { signIn, signingIn } = useSignIn();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function boot() {
      if (!hasTokens()) {
        try {
          await signIn({ remember: true });
        } catch (_) {}
      }
      if (mounted) setReady(true);
    }
    boot();
    return () => {
      mounted = false;
    };
  }, [signIn]);

  if (!ready || signingIn) return null;
  return children;
}
