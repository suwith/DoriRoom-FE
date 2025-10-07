'use client';

import { useRouter } from 'next/navigation';
import useReadNotification from '@/hooks/alert/useReadNotification';
import LoadingContent from '@/app/_components/LoadingContent';
import { useEffect, useState } from 'react';

export default function AlertBox({ noti }) {
  // targetId 상태 제거
  const { mutate, redirectUrl, loading } = useReadNotification();
  const router = useRouter();

  async function handleNoti() {
    // 클릭 시 바로 mutate를 호출하여 API 요청을 시작합니다.
    // useReadNotification 훅 내부에서 loading = true가 되고, 완료 시 loading = false가 됩니다.
    await mutate({ notificationId: noti.notificationId });
  }

  // 2단계: mutate 완료(loading=false)와 redirectUrl의 업데이트를 감시하는 훅
  useEffect(() => {
    // 1. API 요청이 완료되었고 (loading === false)
    // 2. redirectUrl에 유효한 문자열이 있을 때 (''이나 null이 아닐 때)
    if (!loading && redirectUrl) {
      const tmp = redirectUrl.split('/');
      // ID를 추출하고 .trim()을 사용하여 앞뒤 공백을 확실하게 제거합니다.
      const targetId = tmp[tmp.length - 1].trim();
      console.log(targetId);
      // 3. targetId가 공백이 아닌 유효한 문자열인지 확인합니다.
      if (targetId) {
        console.log(targetId);
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
  }, [loading, redirectUrl, noti?.type, router]); // loading과 redirectUrl이 변경될 때만 실행

  if (loading) return <LoadingContent loading={loading} />;

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
