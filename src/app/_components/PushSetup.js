'use client';

import { useRouter } from 'next/navigation'; // Next 13/14 app router
import { useEffect } from 'react';
import { addListeners, registerNotifications } from '@/lib/fcmPush';
import useReadNotification from '@/hooks/alert/useReadNotification';
import { deleteFcmToken } from '@/services/fcm';

export default function PushSetup() {
  const router = useRouter();
  const { mutate } = useReadNotification();

  useEffect(() => {
    // 1. 알림 권한 등록 및 토큰 받기
    registerNotifications();

    // 2. 라우터 인스턴스를 전달하여 리스너 등록
    // 이 시점에서 router는 Next.js의 navigation 객체입니다.
    addListeners(router, mutate);

    // 이펙트 정리 함수 (선택 사항이지만 권장)
    return () => {
      // 리스너 제거 로직 (Capacitor v5/v6에서는 addListener가 자동으로 리턴 함수를 반환하지 않을 수 있으므로, 별도의 제거 함수 필요)
      deleteFcmToken();
    };
  }, [router]);

  return null; // UI를 렌더링하지 않음
}
