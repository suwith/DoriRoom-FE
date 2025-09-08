'use client';

import axiosInstance from '@/lib/axiosInstance';

export async function sendEmailVerification(email) {
  const res = await axiosInstance.post('/auth/find-username', { email });
  return res.data?.content;
}

export async function verifyEmailCode({ email, verificationCode }) {
  const res = await axiosInstance.post('/auth/email/verify', {
    email,
    verificationCode,
  });
  return res.data?.content;
}
