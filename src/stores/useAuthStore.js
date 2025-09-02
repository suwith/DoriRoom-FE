import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  accessToken: null,
  refreshToken: null,
  kind: null, // 'local' | 'session'

  // 토큰 저장 (상태 + 스토리지)
  setTokens: (access, refresh, kind) => {
    if (typeof window !== 'undefined') {
      if (kind === 'local') {
        if (access) localStorage.setItem('access_token', access);
        if (refresh) localStorage.setItem('refresh_token', refresh);
      }
      if (kind === 'session') {
        if (access) sessionStorage.setItem('access_token', access);
        if (refresh) sessionStorage.setItem('refresh_token', refresh);
      }
    }
    set({ accessToken: access, refreshToken: refresh, kind });
  },

  // 토큰 삭제 (상태 + 스토리지)
  clearTokens: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('refresh_token');
    }
    set({ accessToken: null, refreshToken: null, kind: null });
  },

  // 스토리지에서 토큰 읽기
  getStoredTokens: () => {
    if (typeof window === 'undefined') return null;
    const la = localStorage.getItem('access_token');
    const lr = localStorage.getItem('refresh_token');
    if (la && lr) return { accessToken: la, refreshToken: lr, kind: 'local' };

    const sa = sessionStorage.getItem('access_token');
    const sr = sessionStorage.getItem('refresh_token');
    if (sa && sr) return { accessToken: sa, refreshToken: sr, kind: 'session' };

    return null;
  },
}));
