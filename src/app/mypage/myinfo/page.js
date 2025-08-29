'use client';

import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import { MdEditSquare } from 'react-icons/md';
import useChangeProfile from '@/hooks/mypage/useChangeProfile';
import { useProfile } from '../_context/UserInfoProvider';
import { useRouter } from 'next/navigation';

export default function Myinfo() {
  const { info, refetch } = useProfile();
  const { mutate, data, loading } = useChangeProfile({
    onSuccess: () => {
      refetch();
    },
  });

  const handlerFile = async (e) => {
    const file = e.target.files[0];
    await mutate(file);
  };

  return (
    <div className="flex flex-col h-full max-w-[390px] w-screen h-screen">
      <HeaderNavigationBar title="내 정보" />
      <div className="flex-2 flex items-end justify-center px-4">
        <div className="relative mb-12">
          <img
            src={info.profileImageUrl}
            alt="profile_image"
            className="rounded-full w-30 h-30 bg-main-5"
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
