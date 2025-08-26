'use client';

import { useState } from 'react';
import EditHeaderNavBar from '../../_components/EditHeaderNavBar';
import PasswordInput from '../../_components/PasswordInput';

export default function EditNickname() {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');

  return (
    <div className="flex flex-col h-full max-w-[390px] w-screen h-screen px-4 pt-28">
      <EditHeaderNavBar title="닉네임 변경" />
      <div className="flex-1">
        <PasswordInput
          id="current-password"
          label="기존 비밀번호를 입력해 주세요."
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <PasswordInput
          id="new-password"
          label="새 비밀번호를 입력해 주세요."
          placeholder="비밀번호"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="mt-9"
        />
        <PasswordInput
          id="new-password"
          placeholder="비밀번호 확인"
          autoComplete="verify-password"
          value={verifyPassword}
          onChange={(e) => setVerifyPassword(e.target.value)}
          required
        />
        <label className="block font-normal text-xs text-neutral-600 mt-2">
          영문 대문자, 소문자, 숫자, 특수문자 중 2가지 이상 조합으로
          <br />
          6~20자 설정해 주세요.
        </label>
      </div>
    </div>
  );
}
