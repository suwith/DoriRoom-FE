// hooks/auth/useSignup.js
// 회원가입 관련 API 훅/함수 모음 (JavaScript)
// - 의존: lib/axiosInstance.js (baseURL, 인증헤더 등 공통 설정)
// - 주의: 백엔드 스펙에 따라 엔드포인트 경로/응답 구조가 다르면 아래를 맞춰주세요.

import axiosInstance from '@/lib/axiosInstance';

function toReadableError(error) {
  if (error?.response?.data?.message)
    return new Error(error.response.data.message);
  if (error?.response?.status)
    return new Error(`HTTP ${error.response.status}`);
  return new Error('Network error');
}

//  1) 이메일 인증코드 발송
export async function sendSignupEmail(email) {
  const res = await axiosInstance.post('/auth/email', { email });
  const data = res.data;

  if (data?.statusCode && data.statusCode !== 200) {
    console.error(data);
    throw data.error || '이메일 전송 실패';
  }

  return data;
}

//  2) 이메일 인증코드 검증
export async function verifySignupCode({ email, code }) {
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

// 4) 아이디 중복 확인
export async function checkUsernameAvailable(username) {
  const res = await axiosInstance.get('/users/check-username', {
    params: { username },
  });
  const data = res?.data || {};

  if (typeof data.statusCode === 'number' && data.statusCode !== 200) {
    throw data.error || '아이디 중복 확인 실패';
  }

  return { available: true };
}

// 5) 닉네임 중복 확인
export async function checkNicknameAvailable(nickname) {
  const res = await axiosInstance.get('/users/check-nickname', {
    params: { nickname },
  });
  const data = res?.data || {};

  if (typeof data.statusCode === 'number' && data.statusCode !== 200) {
    throw data.error || '닉네임 중복 확인 실패';
  }

  return { available: true };
}

//  6) 회원정보 제출(회원가입)
export async function submitSignupProfile({
  email,
  username,
  password,
  nickname /*, avatarFile */,
}) {
  try {
    const payload = { username, password, email, nickname };
    const res = await axiosInstance.post('/auth/signup', payload);
    return res.data;
  } catch (e) {
    throw toReadableError(e);
  }
}
