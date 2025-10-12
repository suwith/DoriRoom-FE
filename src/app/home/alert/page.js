'use client';

import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import AlertBox from './_components/AlertBox';
import useNotifications from '@/hooks/alert/useNotifications';
import LoadingContent from '@/app/_components/LoadingContent';

export default function AlertPage() {
  const { notifications, loading, error, refetch } = useNotifications();

  if (loading) return <LoadingContent loading={loading} />;

  return (
    <div className="flex justify-center h-screen bg-background header-padding-tb">
      <HeaderNavigationBar title="알림" className="bg-background" />
      <div>
        {notifications?.map((noti) => (
          <AlertBox key={noti.notificationId} noti={noti} />
        ))}
      </div>
    </div>
  );
}
