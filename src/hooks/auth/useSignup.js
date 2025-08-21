// hooks/auth/useSignup.js
'use client';

// 네트워크 대신 Promise + setTimeout으로 응답만 흉내낸다
function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function sendSignupEmail(email) {
  if (!email) throw new Error('Email required');
  await delay(300);
  return { ok: true, message: 'sent' };
}

export async function verifySignupCode({ email, code }) {
  // API 연결 전이므로 항상 성공 처리
  await delay(300);
  return { ok: true };
}

export async function submitSignupProfile({ email, username, password, nickname }) {
  // API 연결 전이므로 기본 성공 처리
  await delay(400);
  return { ok: true, userId: `user_${Date.now()}` };
}

export async function checkUsernameAvailable(username) {
  await delay(300);
  const taken = ['yeonn4', 'admin', 'testuser'];
  return { available: username && !taken.includes(username.toLowerCase()) };
}

export async function checkNicknameAvailable(nickname) {
  await delay(300);
  const taken = ['도리도리', '관리자'];
  return { available: nickname && !taken.includes(nickname) };
}