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
  try {
    const res = await axiosInstance.post('/auth/email', { email });
    return res.data;
  } catch (e) {
    throw toReadableError(e);
  }
}

//  2) 이메일 인증코드 검증
export async function verifySignupCode({ email, code }) {
  try {
    const res = await axiosInstance.post('/auth/email/verify', {
      email,
      verificationCode: code,
    });
    return res.data;
  } catch (e) {
    throw toReadableError(e);
  }
}

//  회원정보 제출(회원가입)

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

// // 4) 아이디 중복 확인
//
// export async function checkUsernameAvailable(username) {
//   try {
//     const res = await axiosInstance.get('/users/check-username', {
//       params: { username },
//     });
//     // 기대 응답 예: { available: true | false }
//     if (typeof res?.data?.available === 'boolean')
//       return { available: res.data.available };
//     // 형태가 다르면 기본 변환
//     return { available: !!res?.data?.available };
//   } catch (e) {
//     // 엔드포인트 미구현(404) 시, 프론트 작업 진행을 위해 임시 true 반환
//     if (e?.response?.status === 404) return { available: true };
//     throw toReadableError(e);
//   }
// }
//
// // 5) 닉네임 중복 확인
// export async function checkNicknameAvailable(nickname) {
//   try {
//     const res = await axiosInstance.get('/users/check-nickname', {
//       params: { nickname },
//     });
//     if (typeof res?.data?.available === 'boolean')
//       return { available: res.data.available };
//     return { available: !!res?.data?.available };
//   } catch (e) {
//     if (e?.response?.status === 404) return { available: true };
//     throw toReadableError(e);
//   }
// }
export async function checkUsernameAvailable(username) {
  const taken = ['yeonn4', 'admin', 'testuser'];
  return { available: username && !taken.includes(username.toLowerCase()) };
}

export async function checkNicknameAvailable(nickname) {
  const taken = ['도리도리', '관리자'];
  return { available: nickname && !taken.includes(nickname) };
}
