'use client';

import { useRouter } from 'next/navigation'; // Next 13/14 app router
import { useEffect } from 'react';
import { addListeners, registerNotifications } from '@/lib/fcmPush';
import useReadNotification from '@/hooks/alert/useReadNotification';

export default function PushSetup() {
  const router = useRouter();
  const { mutate } = useReadNotification();

  useEffect(() => {
    // 1. 알림 권한 등록 및 토큰 받기
    registerNotifications();

    // 2. 라우터 인스턴스를 전달하여 리스너 등록
    // 이 시점에서 router는 Next.js의 navigation 객체입니다.
    addListeners(router, mutate);
  }, [router, mutate]);

  return null; // UI를 렌더링하지 않음
}
