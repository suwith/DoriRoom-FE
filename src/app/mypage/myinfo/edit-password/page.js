'use client';

import { useEffect, useState } from 'react';
import EditHeaderNavBar from '../../_components/EditHeaderNavBar';
import PasswordInput from '../../_components/PasswordInput';
import useChangePW from '@/hooks/mypage/useChangePW';
import { useToast } from '@/app/_providers/ToastProvider';
import { useRouter } from 'next/navigation';

function validPassword(pw) {
  if (!pw) return false;
  const lenOk = pw.length >= 6 && pw.length <= 20;
  const types = [
    /[a-zA-Z]/.test(pw),
    /[0-9]/.test(pw),
    /[^a-zA-Z0-9]/.test(pw),
  ].filter(Boolean).length;
  return lenOk && types >= 2;
}

export default function EditNickname() {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');

  const { show } = useToast();
  const { mutate, statusCode, loading, error } = useChangePW();

  const router = useRouter();
  const passwordOk = validPassword(newPassword);
  const passwordMatch = newPassword && newPassword === verifyPassword;

  useEffect(() => {
    if (statusCode === 200) {
      console.log('실행됨');
      show({ message: '비밀번호가 변경되었어요!', variant: 'success' });
      history.back();
    } else if (statusCode === 400 && error) {
      show({ message: error, variant: 'error' });
    }
  }, [statusCode, error]);

  return (
    <div className="flex flex-col h-full max-w-[390px] w-screen h-screen px-4 pt-28">
      <EditHeaderNavBar
        title="비밀번호 변경"
        onClick={async () =>
          await mutate({
            currentPassword: password,
            newPassword: newPassword,
            confirmPassword: verifyPassword,
          })
        }
      />
      <div className="mb-7">
        <PasswordInput
          id="password"
          label="기존 비밀번호를 입력해 주세요."
          placeholder="비밀번호"
          autoComplete="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-2"
        />
        <PasswordInput
          id="new-password"
          label="새 비밀번호를 입력해 주세요."
          placeholder="비밀번호"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mb-2"
        />
        <PasswordInput
          id="confirm-password"
          placeholder="비밀번호 확인"
          autoComplete="confirm-password"
          value={verifyPassword}
          onChange={(e) => setVerifyPassword(e.target.value)}
        />
        <p className="mt-2 text-xs text-neutral-600 flex flex-col">
          <span>영문 대/소문자, 숫자, 특수문자 중 2가지 이상 조합으로</span>
          <span>6~20자 설정해 주세요.</span>
        </p>
        {!passwordOk && newPassword ? (
          <div className="mt-1 text-xs text-red-600 space-y-1">
            <p className="items-center flex gap-1">
              <i className="mgc_warning_fill text-md pb-0.5" />
              영문 대/소문자, 숫자, 특수문자 중 2가지 이상 조합으로 설정해
              주세요!
            </p>
            <p className="items-center flex gap-1">
              <i className="mgc_warning_fill text-md pb-0.5" />
              6~20자 사이로 설정해 주세요!
            </p>
          </div>
        ) : null}
        {newPassword && verifyPassword && !passwordMatch ? (
          <p className="mt-1 text-xs text-red-600 items-center flex gap-1">
            <i className="mgc_warning_fill text-md pb-0.5" />
            비밀번호가 일치하지 않아요!
          </p>
        ) : null}
        {passwordOk && passwordMatch ? (
          <p className="mt-1 text-xs text-main-100 items-center flex gap-1">
            <i className="mgc_check_fill text-md pb-0.5" />
            확인이 완료되었어요.
          </p>
        ) : null}
      </div>
    </div>
  );
}
