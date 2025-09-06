'use client';

import { useRouter } from 'next/navigation';
import { useProfile } from '../_context/UserInfoProvider';

export default function UserProfile() {
  const { info, loading } = useProfile();
  const router = useRouter();

  if (loading) return null;

  const profileImageUrl =
    info?.profileImageUrl || '/images/profileImage_default.svg';

  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <img
        src={profileImageUrl}
        alt="profile_image"
        className="rounded-full w-23 h-23 object-cover"
      />
      <p className="font-semibold text-xl">{info?.nickname || '익명'}</p>
      <button
        className="font-normal text-sm bg-background rounded-full border border-neutral-200 px-2 py-1"
        onClick={() => router.push('/mypage/myinfo')}
      >
        내 정보
      </button>
    </div>
  );
}
