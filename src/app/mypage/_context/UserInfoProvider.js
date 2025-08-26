'use client';
import { createContext, useContext } from 'react';
import useUserInfo from '@/hooks/mypage/useUserInfo';

const Ctx = createContext(null);
export const useProfile = () => useContext(Ctx);

export default function UserInfoProvider({ children }) {
  const { info, loading, refetch } = useUserInfo();

  return (
    <Ctx.Provider value={{ info, loading, refetch }}>{children}</Ctx.Provider>
  );
}
