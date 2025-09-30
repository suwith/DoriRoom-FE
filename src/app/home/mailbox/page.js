import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import AlertBox from './_components/AlertBox';

export default function page() {
  return (
    <div className="flex justify-center h-screen bg-background header-padding-tb">
      <HeaderNavigationBar title="알림" />
      <div>
        {[1, 2, 3].map((n) => (
          <AlertBox key={n} />
        ))}
      </div>
    </div>
  );
}
