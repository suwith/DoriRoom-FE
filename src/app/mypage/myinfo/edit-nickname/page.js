'use client';

import { useEffect, useState } from 'react';
import EditHeaderNavBar from '../../_components/EditHeaderNavBar';
import TextInput from '../../_components/TextInput';
import useCheckNickname from '@/hooks/mypage/useCheckNickname';
import useChangeNickname from '@/hooks/mypage/useChangeNickname';
import { useToast } from '@/app/_providers/ToastProvider';
import { useRouter } from 'next/navigation';

export default function EditNickname() {
  const [nickname, setNickname] = useState('');

  const { statusCode: CNStatusCode, refetch } = useCheckNickname();
  const { mutate, statusCode: CHNStatusCode, error } = useChangeNickname();
  const { show } = useToast();

  const router = useRouter();
  const nicknameOk = nickname.length > 1 && nickname.length < 11;
  const canChangeNickname = nicknameOk && CNStatusCode === 200 && nickname;

  // 성공 시
  useEffect(() => {
    if (CHNStatusCode === 200) {
      show({ message: '닉네임이 변경되었어요!', variant: 'success' });
      localStorage.setItem('profile:dirty', '1'); // 변경 플래그
      router.back(); //원래 페이지로
    } else if (CHNStatusCode === 409 && error) {
      show({ message: error, variant: 'error' });
    }
  }, [CHNStatusCode, error]);

  return (
    <div className="flex flex-col h-full max-w-[390px] w-screen h-screen px-4 pt-28">
      <EditHeaderNavBar
        title="닉네임 변경"
        onClick={() => {
          if (canChangeNickname) mutate({ nickname });
        }}
      />
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
        onClick={async () => {
          await refetch({ nickname });
        }}
      />
      {CNStatusCode === 409 ? (
        <div className="mt-1 text-xs text-red-600 space-y-1">
          <p className="items-center flex gap-1">
            <i className="mgc_warning_fill text-md pb-0.5" />
            이미 등록되어 있는 닉네임이에요!
          </p>
        </div>
      ) : null}
      {!nicknameOk && nickname ? (
        <p className="mt-1 text-xs text-red-600 items-center flex gap-1">
          <i className="mgc_warning_fill text-md pb-0.5" />
          2~10자 사이로 설정해 주세요!
        </p>
      ) : null}
      {CNStatusCode === 200 && nicknameOk && nickname ? (
        <p className="mt-1 text-xs text-main-100 items-center flex gap-1">
          <i className="mgc_check_fill text-md pb-0.5" />
          확인이 완료되었어요.
        </p>
      ) : null}
    </div>
  );
}
