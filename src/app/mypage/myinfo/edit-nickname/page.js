'use client';

import { useState } from 'react';
import EditHeaderNavBar from '../../_components/EditHeaderNavBar';
import TextInput from '../../_components/TextInput';

export default function EditNickname() {
  const [nickname, setNickname] = useState('');

  return (
    <div className="flex flex-col h-full max-w-[390px] w-screen h-screen px-4 pt-28">
      <EditHeaderNavBar title="닉네임 변경" />
      <div className="flex-1">
        <TextInput
          id="nickname"
          label="닉네임을 입력해 주세요."
          placeholder="닉네임"
          autoComplete="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
          explanation="2~10자까지 설정이 가능해요."
          minLength={2}
          maxLength={10}
        />
      </div>
    </div>
  );
}
