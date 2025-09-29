'use client';

import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import PasswordInput from '../_components/PasswordInput';
import PrimaryButton from '@/app/_components/PrimaryButton';
import useDeleteUser from '@/hooks/mypage/useDeleteUser';
import TwoButtonModal from '@/app/_components/TwoButtonModal';
import LoadingContent from '@/app/_components/LoadingContent';
import { useToast } from '@/app/_providers/ToastProvider';
import { useState, useRef, useEffect } from 'react';

export default function page() {
  const [password, setPassword] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const { mutate, data, loading } = useDeleteUser();
  const { show } = useToast();

  const footerRef = useRef(null);
  const isValid = password.length > 0;

  useEffect(() => {
    if (data?.statusCode === 400)
      show({ message: data?.error, variant: 'error' });
  }, [data]);

  if (loading) return <LoadingContent loading={loading} />;

  return (
    <div className="header-padding-tb w-screen h-screen bg-background mx-auto">
      <HeaderNavigationBar title="회원 탈퇴" />
      <PasswordInput
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mx-4 mt-8"
        label="비밀번호를 입력해 주세요."
      />

      {/* 푸터:
          - 항상 하단 고정 + pb-7 유지
          - 키보드 있을 때는 키보드 바로 위로 고정 */}
      <div
        ref={footerRef}
        className="fixed left-0 right-0 mx-auto px-4 pt-4 pb-7 space-y-5"
        style={{
          bottom: 'calc(env(safe-area-inset-bottom) + var(--kb-offset, 0px))',
          pointerEvents: 'auto',
        }}
      >
        <PrimaryButton disabled={!isValid} onClick={() => setIsOpen(true)}>
          탈퇴하기
        </PrimaryButton>
      </div>

      {isOpen && (
        <TwoButtonModal
          description={
            <>
              앗, 탈퇴하면 모든 데이터가 사라져요!
              <br />
              정말 탈퇴하시겠어요?
            </>
          }
          cancelText="취소할래요"
          confirmText="네, 탈퇴할래요"
          onCancel={() => setIsOpen(false)}
          onConfirm={() => {
            mutate(password);
            setIsOpen(false);
          }}
        />
      )}
    </div>
  );
}
