'use client';

import axiosInstance from '@/lib/axiosInstance';

export async function sendPasswordResetCode(email) {
  const res = await axiosInstance.post('/auth/password/send-code', { email });
  const data = res.data;
  if (data?.statusCode && data.statusCode !== 200) {
    throw data.error || '비밀번호 재설정 코드 발송 실패';
  }
  return data;
}

export async function verifyPasswordResetCode({ email, verificationCode }) {
  const res = await axiosInstance.post('/auth/email/verify', {
    email,
    verificationCode,
  });
  const data = res.data;
  if (data?.statusCode && data.statusCode !== 200) {
    throw data.error || '인증코드 확인 실패';
  }
  return data;
}

export async function resetPassword({ email, code, newPassword }) {
  const res = await axiosInstance.post('/auth/password/reset', {
    email,
    code,
    newPassword,
  });
  const data = res.data;
  if (data?.statusCode && data.statusCode !== 200) {
    throw data.error || '비밀번호 재설정 실패';
  }
  return data;
}
