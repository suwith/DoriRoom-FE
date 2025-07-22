import './globals.css';
import BottomNavBar from './_components/BottomNavBar';

export const metadata = {
  title: 'Dori Room',
  description: 'Collect festivals and personalize your own space.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="bg-gray-100 overflow-hidden">
        <div className="relative max-w-[390px] w-full mx-auto h-screen flex flex-col border-x border-gray-200">
          {/* 고정된 앱 화면 높이에서 */}
          <main className="flex-1 bg-background overflow-y-auto">
            <div className="h-full pb-18">{children}</div>
          </main>
          <BottomNavBar />
        </div>
      </body>
    </html>
  );
}
