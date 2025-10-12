'use client';

import { useRouter } from 'next/navigation';

export default function AlertBox({ noti }) {
  // targetId 상태 제거
  const router = useRouter();

  async function handleNoti() {
    if (noti?.targetId) {
      switch (noti?.type) {
        case 'DIARY_LIKE':
          router.replace(`/diary/${targetId}`);
          break;
        case 'FOLLOWER':
          router.replace(`/neighbor/${targetId}`);
          break;
        case 'GUESTBOOK_ENTRY':
          router.replace(`/home/${targetId}/guest-book`);
          break;
        case 'CHALLENGE_REWARD':
          router.replace('/collection');
          break;
        default:
          router.replace('/');
      }
    } else {
      router.replace('/');
    }
  }

  return (
    <div
      className={`w-screen p-4 ${noti.isRead ? 'bg-background' : 'bg-main-5'}`}
      onClick={handleNoti}
    >
      <div className="flex gap-5">
        <img
          src="/images/alertImage.svg"
          className="w-[52px] h-[52px] rounded-full"
        />
        <div className="flex flex-col w-full">
          <p className="font-normal text-sm">{noti.content}</p>
          <p className="self-end font-normal text-xs text-neutral-400">
            {noti.createdAt}
          </p>
        </div>
      </div>
    </div>
  );
}
