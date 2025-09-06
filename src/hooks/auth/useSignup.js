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
  nickname,
  profileImage,
}) {
  try {
    const formData = new FormData();

    const requestPayload = JSON.stringify({
      username,
      password,
      email,
      nickname,
    });
    formData.append(
      'request',
      new Blob([requestPayload], { type: 'application/json' })
    );

    if (profileImage instanceof File) {
      formData.append('image', profileImage);
    }

    const res = await axiosInstance.post('/auth/signup', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data;
  } catch (e) {
    throw toReadableError(e);
  }
}
