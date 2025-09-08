'use client';

import axiosInstance from '@/lib/axiosInstance';

export async function findUsername(email) {
  const res = await axiosInstance.post('/auth/find-username', { email });
  return res.data?.content; // 서버에서 마스킹된 아이디 반환
}
