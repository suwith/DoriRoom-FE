'use client';

import useUserInfo from '@/hooks/mypage/useUserInfo';

export default function UserProfile() {
  const { info, loading, error } = useUserInfo();

  if (loading) return null;

  return (
    <div className="text-center space-y-4">
      <img
        // src={info.profileImageUrl}
        src="/character.png"
        alt="prifile_image"
        className="rounded-full w-23 h-23"
      />
      <p className="font-semibold text-xl text-black">{info.nickname}</p>
      <button className="font-normal text-sm text-neutral-900 bg-background rounded-full border border-neutral-200 px-2 py-1">
        내 정보
      </button>
    </div>
  );
}
