'use client';

import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import { MdEditSquare } from 'react-icons/md';
import useChangeProfile from '@/hooks/mypage/useChangeProfile';
import { useProfile } from '../_context/UserInfoProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useToast } from '@/app/_providers/ToastProvider';
import LoadingContent from '@/app/_components/LoadingContent';

export default function Myinfo() {
  const { info, loading: PLoading, refetch } = useProfile();
  const { show } = useToast();
  const {
    mutate,
    data,
    loading: CPLoading,
  } = useChangeProfile({
    onSuccess: () => {
      refetch();
      show({ message: '프로필 사진이 변경되었어요!', variant: 'success' });
    },
    onError: (err) => {
      const msg = err?.message ?? '프로필 사진 변경에 실패했어요.';
      show({ message: msg, variant: 'error' });
    },
  });

  useEffect(() => {
    const refreshIfDirty = () => {
      if (localStorage.getItem('profile:dirty')) {
        refetch(); // 서버에서 최신 프로필 재요청
        localStorage.removeItem('profile:dirty');
      }
    };
    // 첫 진입, 포커스 복귀, bfcache 복원 모두 커버
    refreshIfDirty();
    window.addEventListener('focus', refreshIfDirty);
    window.addEventListener('pageshow', refreshIfDirty);
    return () => {
      window.removeEventListener('focus', refreshIfDirty);
      window.removeEventListener('pageshow', refreshIfDirty);
    };
  }, [refetch]);

  const handlerFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await mutate(file);
  };

  if (PLoading) return <LoadingContent loading={PLoading} />;

  return (
    <div className="flex flex-col max-w-[390px] w-screen h-screen">
      <HeaderNavigationBar title="내 정보" />
      <div className="flex-2 flex items-end justify-center px-4">
        <div className="relative mb-12">
          <img
            src={info.profileImageUrl || '/images/profileImage_default.svg'}
            alt="profile_image"
            className="rounded-full w-30 h-30 bg-main-5 object-cover"
          />
          <div
            className="absolute -bottom-1 -right-1 rounded-full p-2 bg-neutral-100"
            style={{ boxShadow: '0 0 3px rgba(0,0,0,0.2)' }}
          >
            <label htmlFor="fileUpload">
              <MdEditSquare className="text-neutral-400 text-base" />
            </label>

            <input
              id="fileUpload"
              type="file"
              accept=".jpg,.jpeg,.png,.gif,.bmp,.webp"
              className="hidden"
              onChange={handlerFile}
            />
          </div>
        </div>
      </div>
      <div className="flex-3 flex flex-col divide-y-2 divide-neutral-100">
        <IconButton
          title="닉네임"
          label={info.nickname}
          showEditBtn={true}
          href={'/mypage/myinfo/edit-nickname'}
        />
        <IconButton title="아이디" label={info.username} />
        <IconButton title="이메일" label={info.email} />
        <IconButton
          title="비밀번호"
          showEditBtn={true}
          href={'/mypage/myinfo/edit-password'}
        />
      </div>
      {CPLoading && (
        <LoadingContent
          loading={CPLoading}
          className="max-w-[390px] w-full h-full fixed top-0 bottom-0 bg-black/25 z-50"
        />
      )}
    </div>
  );
}

function IconButton({ title, label = '', showEditBtn = false, href }) {
  const router = useRouter();
  return (
    <div className="flex items-center space-x-5 py-3 px-4 text-sm">
      <span className="font-semibold">{title}</span>
      {label.length > 0 && <span className="font-normal">{label}</span>}
      {showEditBtn && (
        <button
          className="bg-main-100 rounded-lg px-2 py-1 text-background"
          onClick={() => router.push(href)}
        >
          <p>변경</p>
        </button>
      )}
    </div>
  );
}
