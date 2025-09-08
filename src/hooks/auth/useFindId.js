'use client';

import axiosInstance from '@/lib/axiosInstance';

export async function sendEmailVerification(email) {
  const res = await axiosInstance.post('/auth/email', { email });
  const data = res.data;

  if (data?.statusCode && data.statusCode !== 200) {
    throw data.error || '이메일 전송 실패';
  }

  return data;
}

export async function verifyEmailCode({ email, verificationCode }) {
  const res = await axiosInstance.post('/auth/email/verify', {
    email,
    verificationCode: code,
  });
  const data = res.data;

  if (data?.statusCode && data.statusCode !== 200) {
    throw data.error || '인증코드 확인 실패';
  }

  return data;
}
export async function findUsername(email) {
  const res = await axiosInstance.post('/auth/find-username', { email });
  return res.data?.content; // 서버에서 마스킹된 아이디 반환
}
